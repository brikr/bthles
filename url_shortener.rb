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
    Urls(Short TEXT PRIMARY KEY, Long TEXT, Type TEXT)'
  urls
rescue SQLite3::Exception => e
  puts 'Exception occured when trying to open database'
  puts e
  urls.close if urls
end

# validate url via regexp
def valid?(url)
  url =~ /\A#{URI.regexp(%w(http https))}\z/ && !url.empty?
end

# change from default port to avoid collisions with other sinatra projects
set :port, 4073

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/:shortened' do
  # redirect to shortened url
  # luckily this will just redirect to / if shortened is invalid

  # ready the database
  urls = open_database

  # find the url
  begin
    url = urls.get_first_value 'SELECT Long FROM URLS
                                WHERE Short = :shortened',
                               params['shortened']
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
    shortened = urls.get_first_value 'SELECT Short FROM URLS
                                      WHERE Long = :url',
                                     url

    # return shortened url if we found it in the database
    unless shortened.nil?
      return json(
        error: false,
        url: "bthl.es/#{shortened}"
      )
    end

    # set shortened to the next id otherwise
    output = urls.get_first_value 'SELECT Short FROM URLS
                                   ORDER BY Short DESC
                                   LIMIT 1'
    shortened = (output.base62_decode + 1).base62_encode unless output.nil?
    # special case for first url inserted
    shortened ||= '0'

    # insert the new url into the database
    urls.execute 'INSERT INTO URLS VALUES(:shortened, :url, "url")', shortened,
                 url

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
