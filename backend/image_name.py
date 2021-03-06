import falcon
import json
import os
import uuid

class ImageName():

    def on_put(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.media['name']
        image_id = req.media['id']
        filename = req.media['filename']
        for image_record in data_store['library']['images']:
            if(image_record['id'] == image_id):
                image_record['name'] = name
                break;
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        image_record = {
            'name': name,
            'id': image_id,
            'filename': filename
        }
        body = {
            'status': 'success',
            'data': {
                'image': image_record
            },
            'message': 'Successfully updated image'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

