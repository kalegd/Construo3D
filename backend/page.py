import falcon
import json
import os
import uuid

class Page():

    def on_post(self, req, resp):
        website_id = req.media['website_id']
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        page_id = "{uuid}".format(uuid=uuid.uuid4())
        page_record = None
        for website_record in data_store['websites']:
            if(website_record['id'] == website_id):
                page_record = {
                    'name': "Page " + str(len(website_record['pages']) + 1),
                    'id': page_id,
                    'assets': {},
                    'play_area': {
                        "Width": 100,
                        "Length": 100,
                        "Floor Enabled": False,
                        "Use Image": False,
                        "Image": None,
                        "Image Width": 100,
                        "Image Length": 100,
                        "Color": "#40e0d0",
                        "Use Height Map": False,
                        "Height Map": None,
                        "Minimum Height": 0,
                        "Maximum Height": 100
                    },
                    'skybox': {
                        "Skybox Enabled": False,
                        "skybox_id": None,
                        "Length": 10000
                    },
                    'user_settings': {
                        "Initial X Position": 0,
                        "Initial Y Position": 0,
                        "Initial Z Position": 0,
                        "Camera Height": 1.7,
                        "Movement Speed": 2.5,
                        "Invert Camera Y Axis Controls": True
                    }
                }
                website_record['pages'].append(page_record)
                break;
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'page': page_record,
            },
            'message': 'Successfully created page'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        website_id = req.media['website_id']
        page_id = req.media['page_id']
        #TODO: Delete html document to preview the page
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        for website_record in data_store['websites']:
            if(website_record['id'] == website_id):
                new_pages = list(filter(lambda x : x['id'] != page_id, website_record['pages']))
                website_record['pages'] = new_pages
                break;

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'website_id': website_id,
                'page_id': page_id
            },
            'message': 'Successfully deleted page'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)
