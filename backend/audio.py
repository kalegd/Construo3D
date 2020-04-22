import falcon
import json
import os
import uuid

class Audio():

    def on_post(self, req, resp):
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
        name = req.get_param('name')
        audio = req.get_param('file')
        _, ext = os.path.splitext(audio.filename)
        audio_id = "{uuid}".format(uuid=uuid.uuid4())
        filename = "/library/audios/{uuid}{ext}".format(uuid=audio_id, ext=ext)
        with open('frontend/' + filename, 'wb') as target:
            buf = audio.file.read(1048576) # 1 Megabyte
            while buf:
                target.write(buf)
                buf = audio.file.read(1024)
        file_record = {
            'name': name,
            'id': audio_id,
            'filename': filename
        }
        data_store['library']['audios'].append(file_record)
        with open('data_store.json', 'w') as json_file:
            json_file.write(json.dumps(data_store))

        body = {
            'status': 'success',
            'data': {
                'audio': file_record,
            },
            'message': 'Successfully added audio'
        }
        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)
    def on_delete(self, req, resp):
        audio_id = req.media['id']
        filename = req.media['filename']
        path = "frontend/"
        if(os.path.exists(path + filename)):
            os.remove(path + filename);
        data_store = None
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)

        data_store['library']['audios'].remove(req.media)
        # Replace any occurance of the asset as a parameter with null
        json_string = json.dumps(data_store).replace("\"" + audio_id + "\"", "null")
        with open('data_store.json', 'w') as json_file:
            json_file.write(json_string)

        body = {
            'status': 'success',
            'data': { 'audio': req.media },
            'message': 'Successfully deleted audio'
        }

        resp.status = falcon.HTTP_200
        resp.body = json.dumps(body, ensure_ascii=False)

