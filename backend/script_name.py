import falcon
import json
import os
import uuid

class ScriptName():

    def on_put(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.media['name']
        script_id = req.media['id']
        filename = req.media['filename']
        script_return_record = None
        for script_record in data_store['library']['scripts']:
            if(script_record['id'] == script_id):
                script_record['name'] = name
                script_return_record = script_record
                break;
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'script': script_return_record
            },
            'message': 'Successfully updated script'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

