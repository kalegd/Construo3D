import falcon
import json
import os
import uuid

class AudioName():

    def on_put(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.media['name']
        audio_id = req.media['id']
        filename = req.media['filename']
        for audio_record in data_store['library']['audios']:
            if(audio_record['id'] == audio_id):
                audio_record['name'] = name
                break;
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        audio_record = {
            'name': name,
            'id': audio_id,
            'filename': filename
        }
        body = {
            'status': 'success',
            'data': {
                'audio': audio_record
            },
            'message': 'Successfully updated audio'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

