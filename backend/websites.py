import falcon
import json
import os
import uuid

class Websites():

    def on_put(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        new_websites = req.media
        data_store['websites'] = new_websites

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'websites': new_websites
            },
            'message': 'Successfully updated websites'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

