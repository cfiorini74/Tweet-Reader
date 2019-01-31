import tweepy
from ReadTweets import process_tweets_no_rt, process_tweets_w_rt
import sys
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.streaming import StreamListener
from flask import Flask, render_template, send_from_directory, request, redirect, Response, jsonify, url_for
import os

consumer_key = 'Uo45xaBGhpxf1s4ZxYgw9WigU'
consumer_secret = '0SMMe3hDNEnkySjqlwgTxPldJrf9eN2fxAlX9k5Qjnw98EH0iM'
access_token = '2938474439-3TP97MEWMcoBENUCNS6weybu8mH0nBJWc7Ha9fK'
access_secret = 'jpBSEuyDQLpbmaRMZ9f5A8TI6GPyR8ExbfORnZ1UpiLIY'

auth = OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_secret)

api = tweepy.API(auth)

app = Flask(__name__,static_folder='static')

@app.route("/")
def output():
    return render_template("Frontend.html")

@app.route("/read",methods=['GET','POST'])
def read():
    data=request.get_json()
    if data is None:
        return None
    user=''
    user = data.get('user')
    print("String is " +user, file=sys.stderr)
    try:
        profile = api.get_user(screen_name=user)
    except tweepy.TweepError:
        results={"author":"INVALID_USERNAME"}
        return jsonify(results)
    results=process_tweets_no_rt(api,user)

    return jsonify(results)

@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path,
                                     endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


if __name__ == "__main__":
	app.run(debug=True)
