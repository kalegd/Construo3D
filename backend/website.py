import falcon
import json
import os
import uuid

class Website():

    def on_post(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        website_id = "{uuid}".format(uuid=uuid.uuid4())
        website_record = {
            'name': "Website " + str(len(data_store['websites']) + 1),
            'id': website_id,
            'pages': []
        }
        data_store['websites'].append(website_record)
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'website': website_record,
            },
            'message': 'Successfully created website'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        website_id = req.media['website_id']
        #TODO: Delete html documents to preview the pages of this website
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        new_websites = list(filter(lambda x : x['id'] != website_id, data_store['websites']))
        data_store['websites'] = new_websites

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'website_id': website_id
            },
            'message': 'Successfully deleted website'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)
