import redis
from datetime import datetime, timezone
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from devices.models import *
from rest_framework import status, parsers
from rest_framework.decorators import action
from devices.serializers import *
from rest_framework import permissions
import json
import os
import requests
from django.utils import timezone

# Create your views here.

pathEnv = "/CenterServer/.env.dev"

def get_distributed_analyzer_list_and_sync_to_analyzer():
        try:
            pass
        except Exception as e:
            print(e)

class IoTAnalyzerDevicesView(viewsets.ModelViewSet):
    serializer_class = DevicesSerializer
    queryset = Devices.objects.all()
    permission_classes = [permissions.IsAdminUser]
    parser_classes = (
        parsers.FormParser,
        parsers.MultiPartParser,
        parsers.FileUploadParser,
    )

class DistribtionGraphView(APIView):
    def get(self, request):
        # try:
        elastic_server = os.environ.get("ELASTIC_SERVER", "http://192.168.10.162:7772")
        # elastic_server = "http://192.168.10.162:7772"
        req = requests.get(
            f"{elastic_server}/demo-kc/_search?q=type_log:distribution&size=500&sort=timestamp:desc",
        )
        if req.status_code != 200:
            datas = []
        else:
            datas = req.json().get("hits").get("hits")
        devices = Devices.objects.all()
        distributions = []
        time_now = datetime.datetime.now(timezone.utc).timestamp()
        pairs = []

        edge_te = []
        node_te = [
            {
                "id": "centerserver",
                "label": "Center Server",
                "title": "Center Server",
                "shape": "circularImage",
                "image": f"{os.environ.get('django_ip_local')}/media/centerserver.jpg",
                "size": 40,
                "color": {
                    "border": "black",
                    "hover": {
                        "border": "black",
                    },
                    "hightlight": {
                        "border": "black",
                    },
                },
                "borderWidth": 2,
                "font": {
                    "color": "white",
                },
            },
        ]

        for data in datas:
            data_te = data.get("_source")
            # print(time_now - datetime.fromisoformat(data_te.get("timestamp")).timestamp())
            if (
                time_now
                - datetime.datetime.fromisoformat(data_te.get("timestamp")).timestamp()
            ) <= (30):
                if [data_te.get("from"), data_te.get("to")] not in pairs:
                    pairs.append([data_te.get("from"), data_te.get("to")])
                    from_analyzer = (
                        f"analyzer_{'_'.join(str(data_te.get('from')).split('.'))}"
                    )
                    to_analyzer = (
                        f"analyzer_{'_'.join(str(data_te.get('to')).split('.'))}"
                    )
                    edge_te.append(
                        {
                            "from": from_analyzer,
                            "to": to_analyzer,
                            "arrows": "to",
                            "color": "red",
                            "value": 1,
                        }
                    )
                    distributions.append(data_te.get("from"))
        print("------------", distributions)
        for device in devices:
            id_te = f"analyzer_{'_'.join(str(device.ip).split('.'))}"
            print("___________________________________", id_te)
            if device.ip in distributions:
                node_te.append(
                    {
                        "id": id_te,
                        "label": f"{device.ip}",
                        "title": f"{device.ip}",
                        "shape": "circularImage",
                        "image": f"{os.environ.get('django_ip_local')}/media/device.png",
                        "size": 20,
                        "color": {
                            "border": "red",
                            "hover": {
                                "border": "red",
                            },
                            "hightlight": {
                                "border": "red",
                            },
                        },
                        "borderWidth": 5,
                        "font": {
                            "color": "red",
                        },
                    }
                )
            else:
                node_te.append(
                    {
                        "id": id_te,
                        "label": f"{device.ip}",
                        "title": f"{device.ip}",
                        "shape": "circularImage",
                        "size": 20,
                        "color": {
                            "border": "black",
                            "hover": {
                                "border": "black",
                            },
                            "hightlight": {
                                "border": "black",
                            },
                        },
                        "borderWidth": 2,
                        "font": {
                            "color": "white",
                        },
                    }
                )
            edge_te.append({"from": id_te, "to": "centerserver"})

        resData = {"nodes": node_te, "edges": edge_te}

        return Response(resData, status=status.HTTP_200_OK)
        # except Exception as e:
        #     return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
