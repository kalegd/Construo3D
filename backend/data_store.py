import json
import falcon

class DataStore():

    def on_get(self, req, resp):
        with open('data_store.json') as json_file:
            body = json.load(json_file)
            resp.body = json.dumps(body, ensure_ascii=False)
            resp.status = falcon.HTTP_200
