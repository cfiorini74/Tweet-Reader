import sys
import tweepy
import json
from datetime import datetime


    #Processes all tweets in the users timeline without retweets
def process_tweets_no_rt(api, user):
    result = []
    for status in tweepy.Cursor(api.user_timeline,screen_name=user, tweet_mode="extended",
                                include_rts=False,include_entities=True).items():
        i = 0
        images = ['NO_URL', 'NO_URL', 'NO_URL', 'NO_URL','NO_URL']
        num_of_images = 0
        origdate=str(status.created_at)
        d = datetime.strptime(origdate,'%Y-%m-%d %H:%M:%S')
        date = d.strftime('%m-%d-%y')
        time = str(d.time())
        post_date={'date':d, 'time':time, 'year':d.strftime('%y'),'month':d.strftime('%m'),
                   'day':d.strftime('%d'), 'hour':d.strftime('%H'),'minute':d.strftime('%M'),
                   'second':d.strftime('%S')}
        print("Date is "+ date,file=sys.stderr)

        if 'media' in status.entities:
            for image in status.extended_entities['media']:
                images[i] = str(image['media_url'])
                i+=1
        print(status.user.url, file=sys.stderr)
        result.append({'profile_picture':status.user.profile_image_url ,"profile_url":status.user.url,
                       'status_id': status.id_str,'author': user,'text': status.full_text,
                       'post_date':post_date, 'favorites':status.favorite_count,
                       'retweets': status.retweet_count, "image_one":images[0], "image_two":images[1],
                       "image_three":images[2],"image_four": images[3], 'num_images':i})
        #with open(user+".json", 'w') as f:
        #json.dump(result, f, default=str)
    return result
#Processes all tweets in timeline with retweets
def process_tweets_w_rt(api, user):
    result = []
    for status in tweepy.Cursor(api.user_timeline,screen_name=user, tweet_mode="extended",
                                include_rts=True,include_entities=True).items():
        result = []
        for status in tweepy.Cursor(api.user_timeline, screen_name=user, tweet_mode="extended",
                                    include_rts=False, include_entities=True).items():
            i = 0
            images = ['NO_URL', 'NO_URL', 'NO_URL', 'NO_URL', 'NO_URL']
            num_of_images = 0
            origdate = str(status.created_at)
            d = datetime.strptime(origdate, '%Y-%m-%d %H:%M:%S')
            date = d.strftime('%m-%d-%y')
            time = str(d.time())
            post_date = {'date': d, 'time': time, 'year': d.strftime('%y'), 'month': d.strftime('%m'),
                         'day': d.strftime('%d'), 'hour': d.strftime('%H'), 'minute': d.strftime('%M'),
                         'second': d.strftime('%S')}
            print("Date is " + date, file=sys.stderr)

            if 'media' in status.entities:
                for image in status.extended_entities['media']:
                    images[i] = str(image['media_url'])
                    i += 1
            print(status.user.url, file=sys.stderr)
            result.append({'profile_picture': status.user.profile_image_url, "profile_url": status.user.url,
                           'status_id': status.id_str, 'author': self.user, 'text': status.full_text,
                           'post_date': post_date, 'favorites': status.favorite_count,
                           'retweets': status.retweet_count, "image_one": images[0], "image_two": images[1],
                           "image_three": images[2], "image_four": images[3], 'num_images': i})
            # with open(self.user+".json", 'w') as f:
            # json.dump(result, f, default=str)
        return result