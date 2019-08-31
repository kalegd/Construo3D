import falcon
import json
import os
import uuid

class ModelName():

    def on_put(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.media['name']
        model_id = req.media['id']
        filename = req.media['filename']
        model_return_record = None
        for model_record in data_store['library']['models']:
            if(model_record['id'] == model_id):
                model_record['name'] = name
                model_return_record = model_record
                break;
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'model': model_return_record
            },
            'message': 'Successfully updated model'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

