#!/usr/bin/env ruby

require 'sinatra'
require 'net/http'
require 'base62'

# setup $urls list
# use sqlite here or something
# this is probably really slow
$urls =
  if File.exist?('urls.db')
    Marshal.load(File.read('urls.db'))
  else
    []
  end

# shoutouts to stackoverflow
def valid?(url)
  url =~ /\A#{URI.regexp(%w(http https))}\z/
end

# change from default port to avoid collisions with other sinatra projects
set :port, 4073

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/:shortened' do
  # redirect to shortened url
  # luckily this will just redirect to / if shortened is invalid
  redirect $urls[params['shortened'].base62_decode]
end

post '/' do
  request.body.rewind

  # strip request body
  url = params['url']

  # verify
  return "Invalid URL. <a href='/'>Go back.</a>" unless valid?(url)

  # check if we've already stored it
  if $urls.include? url
    shortened = $urls.index(url).base62_encode
  else
    # if we haven't, add it to the list
    $urls << url
    shortened = ($urls.length - 1).base62_encode
  end

  # reserialize
  File.open('urls.db', 'w') { |f| f.write(Marshal.dump($urls)) }

  # nice output
  "Your shortened url is <a href=#{shortened}>bthl.es/#{shortened}</a>"
end
