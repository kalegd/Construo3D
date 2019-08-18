import json
import falcon

class DataStore():

    def on_get(self, req, resp):
        with open('data_store.json') as json_file:
            data_store = json.load(json_file)
            body = {
                'status': 'success',
                'data': {
                    'data_store': data_store,
                },
                'message': 'Successfully added image'
            }
            resp.body = json.dumps(body, ensure_ascii=False)
            resp.status = falcon.HTTP_200
