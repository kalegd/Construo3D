import falcon
import json
import os
import uuid

class LightVersion():

    def on_post(self, req, resp):
        light_id = req.media['light_id']
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        version_record = None
        lights = data_store['library']['lights']
        for light_record in data_store['library']['lights']:
            if(light_record['id'] == light_id):
                version_record = {
                    "id": "{uuid}".format(uuid=uuid.uuid4()),
                    "name": "V" + str(len(light_record['versions']) + 1)
                }
                for field in light_record['fields']:
                    version_record[field['name']] = field['default']
                light_record['versions'].append(version_record)

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'light_id': light_id,
                'light_version': version_record
            },
            'message': 'Successfully added light version'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_put(self, req, resp):
        name = req.media['name']
        light_id = req.media['light_id']
        version_id = req.media['version_id']
        fields = req.media['fields']

        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        light_version_return_record = None

        for light_record in data_store['library']['lights']:
            if(light_record['id'] == light_id):
                for light_version_record in light_record['versions']:
                    if(light_version_record['id'] == version_id):
                        light_version_record['name'] = name
                        for field in light_record['fields']:
                            light_version_record[field['name']] = fields[field['name']]
                        light_version_return_record = light_version_record
                        break;

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'light_id': light_id,
                'light_version': light_version_return_record
            },
            'message': 'Successfully updated light version'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

    def on_delete(self, req, resp):
        light_id = req.media['light_id']
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        for light_record in data_store['library']['lights']:
            if(light_record['id'] == light_id):
                light_record['versions'].remove(req.media['light_version'])
                break;

        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': { 
                'light_id': light_id,
                'light_version': req.media['light_version']
            },
            'message': 'Successfully deleted light version'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

