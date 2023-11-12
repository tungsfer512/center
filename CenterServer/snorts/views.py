from django.http import JsonResponse, FileResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework import permissions
from .tools import make_rules
from datetime import datetime
from rest_framework.parsers import MultiPartParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .tools.convert import convert
import time
import pandas as pd
import os
import paramiko
from devices.models import Devices

class SftpRequest():
    
    def __init__(self,host,username,password,port):
        self.ssh = paramiko.SSHClient()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(host, username=username, password=password,port=port)
        self.sftp_request = self.ssh.open_sftp()

    def upload_file(self,local_path,remote_path):
        self.sftp_request.put(local_path, remote_path)
    def download_file(self,remote_path,local_path):
        self.sftp_request.get(remote_path,local_path)

# Create your views here.
class CreateRulesViews(APIView):
    parser_classes = (MultiPartParser,)
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_description='Upload attack file...',
                         manual_parameters=[openapi.Parameter(
                             name="attack",
                             in_=openapi.IN_FORM,
                             type=openapi.TYPE_FILE,
                             required=True,
                             description="Attack files"
                         ), openapi.Parameter(
                             name="benign",
                             in_=openapi.IN_FORM,
                             type=openapi.TYPE_FILE,
                             required=True,
                             description="Benign files"
                         )])
    def post(self, request):
        
        UPLOAD_DIR = "./snorts/tools"
        
        if not os.path.exists(f"{UPLOAD_DIR}/uploads"):
            os.makedirs(f"{UPLOAD_DIR}/uploads")
        if not os.path.exists(f"{UPLOAD_DIR}/uploads/attack"):
            os.makedirs(f"{UPLOAD_DIR}/uploads/attack")
        if not os.path.exists(f"{UPLOAD_DIR}/uploads/benign"):
            os.makedirs(f"{UPLOAD_DIR}/uploads/benign")
        if not os.path.exists(f"{UPLOAD_DIR}/csv"):
            os.makedirs(f"{UPLOAD_DIR}/csv")
        if not os.path.exists(f"{UPLOAD_DIR}/csv/attack"):
            os.makedirs(f"{UPLOAD_DIR}/csv/attack")
        if not os.path.exists(f"{UPLOAD_DIR}/csv/benign"):
            os.makedirs(f"{UPLOAD_DIR}/csv/benign")
        
        attack_files = request.FILES.getlist("attack")
        benign_files = request.FILES.getlist("benign")
        
        csv_attack_files = []
        csv_benign_files = []
        
        for attack_file in attack_files:
            filename = str(int(round(datetime.now().timestamp())))
            attack_dest = open(f"{UPLOAD_DIR}/uploads/attack/{filename}.pcap", "wb")
            for chunk in attack_file.chunks():
                attack_dest.write(chunk)
            attack_dest.close()
            time.sleep(5)
            csv_attack_file = convert(filename, 'attack')
            csv_attack_files.append(csv_attack_file)
            time.sleep(5)
        time.sleep(5)
        for benign_file in benign_files:
            filename = str(int(round(datetime.now().timestamp())))
            benign_dest = open(f"{UPLOAD_DIR}/uploads/benign/{filename}.pcap", "wb")
            for chunk in benign_file.chunks():
                benign_dest.write(chunk)
            benign_dest.close()
            time.sleep(5)
            csv_benign_file = convert(filename, 'benign')
            csv_benign_files.append(csv_benign_file)
            time.sleep(5)
        time.sleep(5)
        namere = {
            'ACK Flag Count' : 'ACK Flag Cnt',
            'Active Max' : 'Active Max',
            'Active Mean' : 'Active Mean',
            'Active Min' : 'Active Min',
            'Active Std' : 'Active Std',
            'Bwd Bulk Rate Avg' : 'Bwd Blk Rate Avg',
            'Bwd Bytes/Bulk Avg' : 'Bwd Byts/b Avg',
            'Bwd Header Length' : 'Bwd Header Len',
            'Bwd IAT Max' : 'Bwd IAT Max',
            'Bwd IAT Mean' : 'Bwd IAT Mean',
            'Bwd IAT Min' : 'Bwd IAT Min',
            'Bwd IAT Std' : 'Bwd IAT Std',
            'Bwd IAT Total' : 'Bwd IAT Tot',
            'Bwd PSH Flags' : 'Bwd PSH Flags',
            'Bwd Packet Length Max' : 'Bwd Pkt Len Max',
            'Bwd Packet Length Mean' : 'Bwd Pkt Len Mean',
            'Bwd Packet Length Min' : 'Bwd Pkt Len Min',
            'Bwd Packet Length Std' : 'Bwd Pkt Len Std',
            'Bwd Packet/Bulk Avg' : 'Bwd Pkts/b Avg',
            'Bwd Packets/s' : 'Bwd Pkts/s',
            'Bwd Segment Size Avg' : 'Bwd Seg Size Avg',
            'Bwd URG Flags' : 'Bwd URG Flags',
            'CWR Flag Count' : 'CWE Flag Count', #
            'Down/Up Ratio' : 'Down/Up Ratio',
            'Dst Port' : 'Dst Port',
            'ECE Flag Count' : 'ECE Flag Cnt',
            'FIN Flag Count' : 'FIN Flag Cnt',
            'Flow Bytes/s' : 'Flow Byts/s',
            'Flow Duration' : 'Flow Duration',
            'Flow IAT Max' : 'Flow IAT Max',
            'Flow IAT Mean' : 'Flow IAT Mean',
            'Flow IAT Min' : 'Flow IAT Min',
            'Flow IAT Std' : 'Flow IAT Std',
            'Flow Packets/s' : 'Flow Pkts/s',
            'Fwd Act Data Pkts' : 'Fwd Act Data Pkts',
            'Fwd Bulk Rate Avg' : 'Fwd Blk Rate Avg',
            'Fwd Bytes/Bulk Avg' : 'Fwd Byts/b Avg',
            'Fwd Header Length' : 'Fwd Header Len',
            'Fwd IAT Max' : 'Fwd IAT Max',
            'Fwd IAT Mean' : 'Fwd IAT Mean',
            'Fwd IAT Min' : 'Fwd IAT Min',
            'Fwd IAT Std' : 'Fwd IAT Std',
            'Fwd IAT Total' : 'Fwd IAT Tot',
            'Fwd PSH Flags' : 'Fwd PSH Flags',
            'Fwd Packet Length Max' : 'Fwd Pkt Len Max',
            'Fwd Packet Length Mean' : 'Fwd Pkt Len Mean',
            'Fwd Packet Length Min' : 'Fwd Pkt Len Min',
            'Fwd Packet Length Std' : 'Fwd Pkt Len Std',
            'Fwd Packet/Bulk Avg' : 'Fwd Pkts/b Avg',
            'Fwd Packets/s' : 'Fwd Pkts/s',
            'Fwd Seg Size Min' : 'Fwd Seg Size Min',
            'Fwd Segment Size Avg' : 'Fwd Seg Size Avg',
            'Fwd URG Flags' : 'Fwd URG Flags',
            'Idle Max' : 'Idle Max',
            'Idle Mean' : 'Idle Mean',
            'Idle Min' : 'Idle Min',
            'Idle Std' : 'Idle Std',
            'PSH Flag Count' : 'PSH Flag Cnt',
            'Packet Length Max' : 'Pkt Len Max',
            'Packet Length Mean' : 'Pkt Len Mean',
            'Packet Length Min' : 'Pkt Len Min',
            'Packet Length Std' : 'Pkt Len Std',
            'Packet Length Variance' : 'Pkt Len Var',
            'Average Packet Size' : 'Pkt Size Avg', #
            'Protocol' : 'Protocol',
            'RST Flag Count' : 'RST Flag Cnt',
            'SYN Flag Count' : 'SYN Flag Cnt',
            'Subflow Bwd Bytes' : 'Subflow Bwd Byts',  
            'Subflow Bwd Packets' : 'Subflow Bwd Pkts',
            'Subflow Fwd Bytes' : 'Subflow Fwd Byts',
            'Subflow Fwd Packets' : 'Subflow Fwd Pkts',
            'Timestamp' : 'Timestamp',
            'Total Bwd packets' : 'Tot Bwd Pkts',
            'Total Fwd Packet' : 'Tot Fwd Pkts',
            'Total Length of Bwd Packet' : 'TotLen Bwd Pkts',
            'Total Length of Fwd Packet' : 'TotLen Fwd Pkts',
            'URG Flag Count' : 'URG Flag Cnt',
            'Bwd Init Win Bytes': 'Init Bwd Win Byts',
            'FWD Init Win Bytes': 'Init Fwd Win Byts',
        }
        attack_df = pd.DataFrame()
        for csv_attack_file in csv_attack_files:
            if os.path.exists(f"{UPLOAD_DIR}/csv/{csv_attack_file}"):
                te_df = pd.read_csv(f"{UPLOAD_DIR}/csv/{csv_attack_file}")
                te_df = te_df[te_df['Label'] != "Label"]
                attack_df = pd.concat([attack_df, te_df], axis=0)
            else:
                print("file not exist")
        attack_df = attack_df.rename(columns=namere)
        attack_df.drop(['Flow ID', 'Src IP', 'Src Port', 'Dst IP'], axis=1, inplace=True)
        attack_df['Label'].replace('NeedManualLabel','Attack',inplace=True)
        
        benign_df = pd.DataFrame()
        for csv_benign_file in csv_benign_files:
            if os.path.exists(f"{UPLOAD_DIR}/csv/{csv_benign_file}"):
                te_df = pd.read_csv(f"{UPLOAD_DIR}/csv/{csv_benign_file}")
                te_df = te_df[te_df['Label'] != "Label"]
                benign_df = pd.concat([benign_df, te_df], axis=0)
            else:
                print("file not exist")
        benign_df = benign_df.rename(columns=namere)
        benign_df.drop(['Flow ID', 'Src IP', 'Src Port', 'Dst IP'], axis=1, inplace=True)
        benign_df['Label'].replace('NeedManualLabel','Benign',inplace=True)
        
        df = pd.concat([attack_df, benign_df], axis=0)
        print(df.info())
        res = []
        res = make_rules.auto_make_rules(df=df)
        SNORT_PATH = "./kc-static-files/snort/local.rules"
        open(SNORT_PATH, "w").write("\n".join(res))
        time.sleep(5)
        pcap_attack_paths = os.listdir(f"{UPLOAD_DIR}/uploads/attack/")
        pcap_benign_paths = os.listdir(f"{UPLOAD_DIR}/uploads/benign/")
        csv_attack_paths = os.listdir(f"{UPLOAD_DIR}/csv/attack/")
        csv_benign_paths = os.listdir(f"{UPLOAD_DIR}/csv/benign/")
        
        for pcap_attack_path in pcap_attack_paths: 
            os.remove(os.path.join(f"{UPLOAD_DIR}/uploads/attack/", pcap_attack_path))
        for pcap_benign_path in pcap_benign_paths: 
            os.remove(os.path.join(f"{UPLOAD_DIR}/uploads/benign/", pcap_benign_path))
        for csv_attack_path in csv_attack_paths: 
            os.remove(os.path.join(f"{UPLOAD_DIR}/csv/attack/", csv_attack_path))
        for csv_benign_path in csv_benign_paths: 
            os.remove(os.path.join(f"{UPLOAD_DIR}/csv/benign/", csv_benign_path))
        device = Devices.objects.all().first()
        sftp_request = SftpRequest(device.ip,"foo","pass","2222")
        sftp_request.upload_file(SNORT_PATH,f'rules/local.rules')
        return JsonResponse({"data": res}, status=status.HTTP_200_OK)
    
    def get(self, request):
        SNORT_PATH = "./kc-static-files/snort/local.rules"
        file = open(SNORT_PATH, "rb")
        return FileResponse(file, status=status.HTTP_200_OK)

class GetImage(APIView):
    def get(self, request):
        file = open("./snorts/tools/images/tree.png", "rb")
        return FileResponse(file, status=status.HTTP_200_OK)