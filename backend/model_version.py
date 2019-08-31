import falcon
import json
import os
import uuid

class ModelVersion():

    def on_post(self, req, resp):
        model_id = req.media['model_id']
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        version_record = None
        for model_record in data_store['library']['models']:
            if(model_record['id'] == model_id):
                version_record = {
                    "id": "{uuid}".format(uuid=uuid.uuid4()),
                    "name": "V" + str(len(model_record['versions']) + 1)
                }
                for field in model_record['fields']:
                    version_record[field['name']] = field['default']
                model_record['versions'].append(version_record)

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'model_id': model_id,
                'model_version': version_record
            },
            'message': 'Successfully added model version'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_put(self, req, resp):
        name = req.media['name']
        model_id = req.media['model_id']
        version_id = req.media['version_id']
        fields = req.media['fields']

        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        model_version_return_record = None

        for model_record in data_store['library']['models']:
            if(model_record['id'] == model_id):
                for model_version_record in model_record['versions']:
                    if(model_version_record['id'] == version_id):
                        model_version_record['name'] = name
                        for field in model_record['fields']:
                            model_version_record[field['name']] = fields[field['name']]
                        model_version_return_record = model_version_record
                        break;

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'model_id': model_id,
                'model_version': model_version_return_record
            },
            'message': 'Successfully updated model version'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        model_id = req.media['model_id']
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        for model_record in data_store['library']['models']:
            if(model_record['id'] == model_id):
                model_record['versions'].remove(req.media['model_version'])
                break;

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': { 
                'model_id': model_id,
                'model_version': req.media['model_version']
            },
            'message': 'Successfully deleted model version'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

