#!/usr/bin/env ruby

require 'sinatra'
require 'sinatra/json'
require 'sinatra/reloader'
require 'net/http'
require 'base62'
require 'sqlite3'

# open urls database
def open_database
  urls = SQLite3::Database.new 'urls.db'
  urls.execute 'CREATE TABLE IF NOT EXISTS
    Urls(
      Id INTEGER PRIMARY KEY,
      Long TEXT,
      Type TEXT,
      Hits INTEGER
    )'
  urls
rescue SQLite3::Exception => e
  puts 'Exception occured when trying to open database'
  puts e
  urls.close if urls
end

# validate url via regexp
# pulled from https://github.com/jzaefferer/jquery-validation/
def valid?(url)
  url =~ %r{
    ^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)
    (?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})
    (?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|
    22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|
    2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)
    (?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*
    (?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$
  }ix && !url.empty?
end

# change from default port to avoid collisions with other sinatra projects
set :port, 4073

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/_stats/:shortened' do
  urls = open_database

  id = params['shortened'].base62_decode

  begin
    urls.results_as_hash = true
    url = urls.get_first_row('SELECT * FROM Urls
                              WHERE Id = :id', id)

    if url.nil?
      return json(
        error: true,
        message: 'Invalid URL'
      )
    end

    json(
      error: false,
      hits: url['Hits'],
      long: url['Long'],
      type: url['Type']
    )
  rescue SQLite3::Exception => e
    puts e
    json(
      error: true,
      message: 'Database error'
    )
  ensure
    urls.close
  end
end

get '/:shortened' do
  # redirect to shortened url
  # luckily this will just redirect to / if shortened is invalid

  # ready the database
  urls = open_database

  id = params['shortened'].base62_decode

  # find the url
  begin
    url = urls.get_first_value('SELECT Long FROM Urls
                                WHERE Id = :id', id)
    urls.execute('UPDATE Urls SET Hits = Hits + 1
                  WHERE Id = :id', id)
  rescue SQLite3::Exception => e
    puts e
    '<a href="/">Database error</a>'
  ensure
    urls.close
  end

  # redirect
  # if this is nil, it will just take us home
  redirect url
end

post '/' do
  # get url from post
  url = params['url']

  # cleanup if necessary
  url.prepend('http://') unless url.start_with?('http://', 'https://')

  # verify
  return json(error: true, message: 'Invalid URL') unless valid?(url)

  begin
    # ready the database
    urls = open_database

    # check if we've already stored it
    id = urls.get_first_value('SELECT Id FROM Urls
                               WHERE Long = :url', url)

    # return shortened url if we found it in the database
    unless id.nil?
      return json(
        error: false,
        url: "bthl.es/#{id.base62_encode}"
      )
    end

    # set shortened to the next id otherwise
    id = urls.get_first_value('SELECT Id FROM Urls
                               ORDER BY Id DESC LIMIT 1')
    id += 1 unless id.nil?
    # special case for first url inserted
    id ||= 0
    shortened = id.base62_encode

    # insert the new url into the database
    urls.execute('INSERT INTO Urls VALUES(:id, :url, "url", 0)', id, url)

    # nice output
    json(
      error: false,
      url: "bthl.es/#{shortened}"
    )
  rescue SQLite3::Exception => e
    puts e
    json(
      error: true,
      message: 'Database error'
    )
  ensure
    urls.close
  end
end
