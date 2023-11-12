from django.shortcuts import render
from django.http import HttpResponse, FileResponse
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django_filters.rest_framework import DjangoFilterBackend
from devices.models import *
from rest_framework import status, parsers
from rest_framework.decorators import action
from devices.serializers import *
import os
from os.path import isfile
import logging
from .hash import hash_file
from .tools.getip import getIpGithub
import time
from pathlib import Path
from .scheduler import device_scheduler
from .tools import validateip
from .models import BlacklistSrc, WhitelistSrc
from.serializers import BlacklistSrcSerializer, WhitelistSrcSerializer
from CenterServer.env_dev import *
from devices.tools import mail, sms, tele
from datetime import timedelta
import xlsxwriter

# Create your views here.

pathEnv = "/CenterServer/.env.dev"


class AgentHashView(APIView):
    def get(self, request):
        try:
            AGENT_BASE_DIR = "./kc-static-files/build/"
            filenames = os.listdir(AGENT_BASE_DIR)
            filenames = [filename for filename in filenames if (isfile(AGENT_BASE_DIR + filename) and "." not in filename)]
            data = []
            for filename in filenames:
                hash_code = hash_file(AGENT_BASE_DIR + filename)
                te = {
                    "file": filename,
                    "hash": hash_code
                }
                data.append(te)
            
            return Response({
                "data": data,
                "count": len(data)
            })
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)   
        
class AgentHashDownloadView(APIView):
    def get(self, request, filename):
        try:
            AGENT_BASE_DIR = "./kc-static-files/build/"
            file = open(AGENT_BASE_DIR + filename, "rb")
            return FileResponse(file, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(e)
            return Response(data={'status': str(e)}, status=status.HTTP_400_BAD_REQUEST)   
        
class AutoGetBlackListView(APIView):
    def get(self, request):
        try:
            queryset = BlackListIP.objects.all()
            black_srcs =  BlacklistSrc.objects.all()
            data = []
            for black_src in black_srcs:
                path = black_src.url
                file_type = black_src.file_type
                src_type = black_src.src_type
                if src_type == "github":
                    response = getIpGithub(path, file_type)
                for text in response:
                    data.extend(text.split("\n"))
                    time.sleep(1)
                data.append(response)
            ips = data
            i = 1
            for ip in ips:
                if queryset.filter(ip=ip).first() == None and BlackListIP.objects.all().filter(ip=ip).first() == None and validateip.is_ipv4(ip):
                    black = BlackListIPSerializer(data={
                        'ip':ip,
                    })
                    if black.is_valid():
                        black.save()
                        print(f"{i}/{len(ips)}")
                        i += 1
            return Response({
                'msg': 'blacklist successful',
                'data': len(ips)
            }, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({
                'msg': str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
            
    def auto_get_blacklist():
        queryset = BlackListIP.objects.all()
        black_srcs =  BlacklistSrc.objects.all()
        data = []
        for black_src in black_srcs:
            path = black_src.url
            file_type = black_src.file_type
            src_type = black_src.src_type
            if src_type == "github":
                response = getIpGithub(path, file_type)
            for text in response:
                data.extend(text.split("\n"))
                time.sleep(1)
            data.append(response)
        ips = data
        i = 1
        for ip in ips:
            if queryset.filter(ip=ip).first() == None and BlackListIP.objects.all().filter(ip=ip).first() == None and validateip.is_ipv4(ip):
                black = BlackListIPSerializer(data={
                    'ip':ip,
                })
                if black.is_valid():
                    black.save()
                    print(f"{i}/{len(ips)}")
                    i += 1

class AutoGetWhiteListView(APIView):
    def get(self, request):
        try:
            queryset = WhiteListIP.objects.all()
            white_srcs =  WhitelistSrc.objects.all()
            data = []
            for white_src in white_srcs:
                path = white_src.url
                file_type = white_src.file_type
                src_type = white_src.src_type
                if src_type == "github":
                    response = getIpGithub(path, file_type)
                for text in response:
                    data.extend(text.split("\n"))
                    time.sleep(1)
                data.append(response)
            ips = data
            i = 1
            for ip in ips:
                if queryset.filter(ip=ip).first() == None and WhiteListIP.objects.all().filter(ip=ip).first() == None and validateip.is_ipv4(ip):
                    white = WhiteListIPSerializer(data={
                        'ip':ip,
                    })
                    if white.is_valid():
                        white.save()
                        print(f"{i}/{len(ips)}")
                        i += 1
            return Response({
                'msg': 'whitelist successful',
                'data': len(ips)
            }, status=status.HTTP_200_OK)
        except Exception as err:
            return Response({
                'msg': str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def auto_get_whitelist():
        queryset = WhiteListIP.objects.all()
        white_srcs =  WhitelistSrc.objects.all()
        data = []
        for white_src in white_srcs:
            path = white_src.url
            file_type = white_src.file_type
            src_type = white_src.src_type
            if src_type == "github":
                response = getIpGithub(path, file_type)
            for text in response:
                data.extend(text.split("\n"))
                time.sleep(1)
            data.append(response)
        ips = data
        i = 1
        for ip in ips:
            if queryset.filter(ip=ip).first() == None and WhiteListIP.objects.all().filter(ip=ip).first() == None and validateip.is_ipv4(ip):
                white = WhiteListIPSerializer(data={
                    'ip':ip,
                })
                if white.is_valid():
                    white.save()
                    print(f"{i}/{len(ips)}")
                    i += 1

class AutoGetBlacklist(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoGetBlacklist = ""
        for item in arr:
            if (item.find('AUTO_UPDATE_BLACKLIST_SECOND') != -1):
                autoGetBlacklist = item
        value = autoGetBlacklist.split("=")
        return HttpResponse(value[1])
    def delete(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_BLACKLIST_SECOND') != -1):
                arr[i] = 'AUTO_UPDATE_BLACKLIST_SECOND=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto get black ip list.")

class PutAutoGetBlacklist(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_BLACKLIST_SECOND') != -1):
                arr[i] = 'AUTO_UPDATE_BLACKLIST_SECOND=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto get black ip list.")
    
class AutoGetWhitelist(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        autoGetWhitelist = ""
        for item in arr:
            if (item.find('AUTO_UPDATE_WHITELIST_SECOND') != -1):
                autoGetWhitelist = item
        value = autoGetWhitelist.split("=")
        return HttpResponse(value[1])
    
    def delete(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_WHITELIST_SECOND') != -1):
                arr[i] = 'AUTO_UPDATE_WHITELIST_SECOND=' + str(-1)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Pause auto get white ip list.")
    
class PutAutoGetWhitelist(APIView):
    def put(self, request, seconds=(60 * 60)):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        for i in range(len(arr)):
            if (arr[i].find('AUTO_UPDATE_WHITELIST_SECOND') != -1):
                arr[i] = 'AUTO_UPDATE_WHITELIST_SECOND=' + str(seconds)
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        device_scheduler.restart()
        return HttpResponse("Changed seconds auto get white ip list.")
    
class EmailSMSView(APIView):
    def get(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        res = []
        for item in arr:
            if (item.find('SENDER_EMAIL') != -1):
                value = item.split("=")
                res.append(get_env("SENDER_EMAIL", value[1]))
            elif (item.find('SENDER_APP_PASSWORD') != -1):
                value = item.split("=")
                res.append(get_env("SENDER_APP_PASSWORD", value[1]))
            elif (item.find('SENDER_PHONE_PREFIX') != -1):
                value = item.split("=")
                res.append(get_env("SENDER_PHONE_PREFIX", value[1]))
            elif (item.find('SENDER_PHONE') != -1) and ((item.find('SENDER_PHONE_PREFIX') == -1)):
                value = item.split("=")
                res.append(get_env("SENDER_PHONE", value[1]))
            elif (item.find('RECEIVER_PHONE_PREFIX') != -1):
                value = item.split("=")
                res.append(get_env("RECEIVER_PHONE_PREFIX", value[1]))
            elif (item.find('TWILIO_ACCOUNT_SID') != -1):
                value = item.split("=")
                res.append(get_env("TWILIO_ACCOUNT_SID", value[1]))
            elif (item.find('TWILIO_AUTH_TOKEN') != -1):
                value = item.split("=")
                res.append(get_env("TWILIO_AUTH_TOKEN", value[1]))
            elif (item.find('AUTO_SEND_MAIL_SECOND') != -1):
                value = item.split("=")
                res.append(get_env("AUTO_SEND_MAIL_SECOND", value[1]))
            elif (item.find('AUTO_SEND_SMS_SECOND') != -1):
                value = item.split("=")
                res.append(get_env("AUTO_SEND_SMS_SECOND", value[1]))
            elif (item.find('AUTO_SEND_TELE_SECOND') != -1):
                value = item.split("=")
                res.append(get_env("AUTO_SEND_TELE_SECOND", value[1]))
            elif (item.find('TELEGRAM_BOT_API_TOKEN') != -1):
                value = item.split("=")
                res.append(get_env("TELEGRAM_BOT_API_TOKEN", value[1]))
        print(res)
        data = {
            'sender_email': res[0], 
            'sender_app_password': res[1], 
            'sender_phone_prefix': res[2], 
            'sender_phone': res[3], 
            'receiver_phone_prefix': res[4], 
            'twilio_account_sid': res[5], 
            'twilio_auth_token': res[6],
            'time_mail': res[7],
            'time_sms': res[8],
            'time_tele': res[9],
            'tele_bot_api_token': res[10],
        }
        return Response(data, status=status.HTTP_200_OK)
    
    
    def put(self, request):
        contents = Path(pathEnv).read_text()
        arr = contents.split(chr(10))
        res = []
        data = request.data
        update_env(key="SENDER_EMAIL", value=data.get('sender_email'))
        update_env(key="SENDER_APP_PASSWORD", value=data.get('sender_app_password'))
        update_env(key="SENDER_PHONE_PREFIX", value=data.get('sender_phone_prefix'))
        update_env(key="SENDER_PHONE", value=data.get('sender_phone'))
        update_env(key="RECEIVER_PHONE_PREFIX", value=data.get('receiver_phone_prefix'))
        update_env(key="TWILIO_ACCOUNT_SID", value=data.get('twilio_account_sid'))
        update_env(key="TWILIO_AUTH_TOKEN", value=data.get('twilio_auth_token'))
        update_env(key="AUTO_SEND_MAIL_SECOND", value=data.get('time_mail'))
        update_env(key="AUTO_SEND_SMS_SECOND", value=data.get('time_sms'))
        update_env(key="AUTO_SEND_TELE_SECOND", value=data.get('time_tele'))
        update_env(key="TELEGRAM_BOT_API_TOKEN", value=data.get('tele_bot_api_token'))
        for i in range(len(arr)):
            if (arr[i].find('SENDER_EMAIL') != -1):
                arr[i] = 'SENDER_EMAIL=' + data.get('sender_email')
            elif (arr[i].find('SENDER_APP_PASSWORD') != -1):
                arr[i] = 'SENDER_APP_PASSWORD=' + data.get('sender_app_password')
            elif (arr[i].find('SENDER_PHONE_PREFIX') != -1):
                arr[i] = 'SENDER_PHONE_PREFIX=' + data.get('sender_phone_prefix')
            elif (arr[i].find('SENDER_PHONE') != -1):
                arr[i] = 'SENDER_PHONE=' + data.get('sender_phone')
            elif (arr[i].find('RECEIVER_PHONE_PREFIX') != -1):
                arr[i] = 'RECEIVER_PHONE_PREFIX=' + data.get('receiver_phone_prefix')
            elif (arr[i].find('TWILIO_ACCOUNT_SID') != -1):
                arr[i] = 'TWILIO_ACCOUNT_SID=' + data.get('twilio_account_sid')
            elif (arr[i].find('TWILIO_AUTH_TOKEN') != -1):
                arr[i] = 'TWILIO_AUTH_TOKEN=' + data.get('twilio_auth_token')
            elif (arr[i].find('AUTO_SEND_MAIL_SECOND') != -1):
                arr[i] = 'AUTO_SEND_MAIL_SECOND=' + data.get('time_mail')
            elif (arr[i].find('AUTO_SEND_SMS_SECOND') != -1):
                arr[i] = 'AUTO_SEND_SMS_SECOND=' + data.get('time_sms')
            elif (arr[i].find('AUTO_SEND_TELE_SECOND') != -1):
                arr[i] = 'AUTO_SEND_TELE_SECOND=' + data.get('time_tele')
            elif (arr[i].find('TELEGRAM_BOT_API_TOKEN') != -1):
                arr[i] = 'TELEGRAM_BOT_API_TOKEN=' + data.get('tele_bot_api_token')
        res = ""
        for i in range(len(arr)):
            res += arr[i]
            if i < len(arr) - 1:
                res += chr(10)
        print(res)
        open(pathEnv, 'w').close()
        f = open(pathEnv, 'w')
        f.write(res)
        f.close()
        return Response("success", status=status.HTTP_200_OK)
    
class BlackListSrcsView(APIView):
    def get(self, request):
        srcs = BlacklistSrc.objects.all()
        return Response({
            "data": BlacklistSrcSerializer(srcs, many=True).data
        }, status=status.HTTP_200_OK)
        
    def post(self, request):
        try:
            data = request.data
            src = BlacklistSrc.objects.all().filter(url=data.get("url")).first()
            if src != None:
                return Response({
                    "message": "Source already exist"
                }, status=status.HTTP_400_BAD_REQUEST)
            serializer = BlacklistSrcSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            return Response({
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WhiteListSrcsView(APIView):
    def get(self, request):
        srcs = WhitelistSrc.objects.all()
        return Response({
            "data": WhitelistSrcSerializer(srcs, many=True).data
        }, status=status.HTTP_200_OK)
        
    def post(self, request):
        try:
            data = request.data
            src = WhitelistSrc.objects.all().filter(url=data.get("url")).first()
            if src != None:
                return Response({
                    "message": "Source already exist"
                }, status=status.HTTP_400_BAD_REQUEST)
            serializer = WhitelistSrcSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
            return Response({
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class BlacklistSrcByIdView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            black = BlacklistSrc.objects.all().filter(id=kwargs.get("id")).first()
            if black != None:
                return Response({
                    "data": BlacklistSrcSerializer(black).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Source not found"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, *args, **kwargs):
        try:
            black = BlacklistSrc.objects.all().filter(id=kwargs.get("id")).first()
            data = request.data
            if black != None:
                serializer = BlacklistSrcSerializer(black, data=data)
                if serializer.is_valid():
                    serializer.save()
                return Response({
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Source not found"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, *args, **kwargs):
        try:
            black = BlacklistSrc.objects.all().filter(id=kwargs.get("id")).first()
            if black != None:
                black.delete()
                return Response({
                    "message": "Delete source successfull"
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Source not found"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class WhitelistSrcByIdView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            white = WhitelistSrc.objects.all().filter(id=kwargs.get("id")).first()
            if white != None:
                return Response({
                    "data": WhitelistSrcSerializer(white).data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Source not found"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request, *args, **kwargs):
        try:
            white = WhitelistSrc.objects.all().filter(id=kwargs.get("id")).first()
            data = request.data
            if white != None:
                serializer = WhitelistSrcSerializer(white, data=data)
                if serializer.is_valid():
                    serializer.save()
                return Response({
                    "data": serializer.data
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Source not found"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self, request, *args, **kwargs):
        try:
            white = WhitelistSrc.objects.all().filter(id=kwargs.get("id")).first()
            if white != None:
                white.delete()
                return Response({
                    "message": "Delete source successfull"
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Source not found"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as err:
            return Response({
                "message": str(err)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
class AutoSendMailView(APIView):
    def auto_send_mail():
        try:
            time_auto = int(get_env("AUTO_SEND_MAIL_SECOND", 60 * 60 * 24))
            if time_auto == -1:
                time_auto = 60 * 60 * 24
            # print("time111111111111111111111111111111111, ", time_auto)
            days = time_auto // (60 * 60 * 24)
            time_auto -= (60 * 60 * 24 * days)
            hours = time_auto // (60 * 60)
            time_auto -= (60 * 60 * hours)
            mins = time_auto // (60)
            time_auto -= (60 * mins)
            secs = time_auto
            time_start = datetime.datetime.strftime(datetime.datetime.now() - timedelta(days=days, hours=hours, minutes=mins, seconds=secs), '%y-%m-%dT%H:%M:%S.%fZ')
            time_end = datetime.datetime.strftime(datetime.datetime.now(), '%y-%m-%dT%H:%M:%S.%fZ')
            analyzers = Devices.objects.all()
            for analyzer in analyzers:
                result = Alerts.objects.all().filter(timestamp__range=(time_start, time_end))
                            
                output = "./devices/attach.xlsx"
                workbook = xlsxwriter.Workbook(output)
                worksheet = workbook.add_worksheet()
                worksheet.write('A1', 'STT')
                worksheet.write('B1', 'Mã thiết bị')
                worksheet.write('C1', 'Địa chỉ ip')
                worksheet.write('D1', 'Cảnh báo')
                worksheet.write('E1', 'Hash')
                worksheet.write('F1', 'PID')
                worksheet.write('G1', 'Thời gian')
                for i in range(len(result)):
                    worksheet.write(f'A{i + 2}', i + 1)
                    worksheet.write(f'B{i + 2}', result[i].device_id)
                    worksheet.write(f'C{i + 2}', result[i].ip)
                    worksheet.write(f'D{i + 2}', result[i].message)
                    worksheet.write(f'E{i + 2}', result[i].hash)
                    worksheet.write(f'F{i + 2}', result[i].pid)
                    worksheet.write(f'G{i + 2}', str(result[i].timestamp))
                workbook.close()
                    
                subject = f'''Tổng hợp các lần tấn công trong ngày '''
                body = f'''Phát hiện tổng cộng {len(result)} lần mạng lưới thiết bị IoT bị tấn công'''
                recipients = [analyzer.email]
                mail.send_email(subject=subject, body=body, recipients=recipients)
            return Response({
                'message': "Sent email"
            }, status=status.HTTP_200_OK)
        except Exception as e:
            logging.error(e)
            return Response(data={'status': False, 'Log bug': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AutoSendSmsView(APIView):
    def auto_send_sms():
        try:
            time_auto = int(get_env("AUTO_SEND_SMS_SECOND", 60 * 60 * 24))
            if time_auto == -1:
                time_auto = 60 * 60 * 24
            # print("time111111111111111111111111111111111, ", time_auto)
            days = time_auto // (60 * 60 * 24)
            time_auto -= (60 * 60 * 24 * days)
            hours = time_auto // (60 * 60)
            time_auto -= (60 * 60 * hours)
            mins = time_auto // (60)
            time_auto -= (60 * mins)
            secs = time_auto
            time_start = datetime.datetime.strftime(datetime.datetime.now() - timedelta(days=days, hours=hours, minutes=mins, seconds=secs), '%y-%m-%dT%H:%M:%S.%fZ')
            time_end = datetime.datetime.strftime(datetime.datetime.now(), '%y-%m-%dT%H:%M:%S.%fZ')
            analyzers = Devices.objects.all()
            for analyzer in analyzers:
                result = Alerts.objects.all().filter(timestamp__range=(time_start, time_end))

                body = f'''Trong vòng {days} ngày {hours} giờ {mins} phút {secs} giây vừa qua, đã có tổng cộng {len(result)} cuộc tấn công vào mạng lưới thiết bị IoT của bạn. Vui lòng kiểm tra email để biết thêm chi tiết.'''

                recipients = get_env('RECEIVER_PHONE_PREFIX') + analyzer.phone[1:]
                sender = get_env("SENDER_PHONE_PREFIX", "+1") + get_env("SENDER_PHONE", "5076205535")
                sms.send_sms(from_=sender, to_=recipients, body_=body)
            return Response({
                'message': f"Sent sms"
            }, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({
                'message': str(error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AutoSendTeleView(APIView):
    def auto_send_tele():
        try:
            time_auto = int(get_env("AUTO_SEND_TELE_SECOND", 60 * 60 * 24))
            if time_auto == -1:
                time_auto = 60 * 60 * 24
            # print("time111111111111111111111111111111111, ", time_auto)
            days = time_auto // (60 * 60 * 24)
            time_auto -= (60 * 60 * 24 * days)
            hours = time_auto // (60 * 60)
            time_auto -= (60 * 60 * hours)
            mins = time_auto // (60)
            time_auto -= (60 * mins)
            secs = time_auto
            time_start = datetime.datetime.strftime(datetime.datetime.now() - timedelta(days=days, hours=hours, minutes=mins, seconds=secs), '%y-%m-%dT%H:%M:%S.%fZ')
            time_end = datetime.datetime.strftime(datetime.datetime.now(), '%y-%m-%dT%H:%M:%S.%fZ')
            analyzers = Devices.objects.all()
            for analyzer in analyzers:
                result = Alerts.objects.all().filter(timestamp__range=(time_start, time_end))

                body = f'''Trong vòng {days} ngày {hours} giờ {mins} phút {secs} giây vừa qua, đã có tổng cộng {len(result)} cuộc tấn công vào mạng lưới thiết bị IoT của bạn. Vui lòng kiểm tra email để biết thêm chi tiết.'''

                recipients = analyzer.telegram_id
                # if len(result) > 0:
                print("+++++++++++++++++++++++++++++++++++++++++++++")
                tele.send_to_telegram(message=body, chat_id=recipients)
            return Response({
                'message': f"Sent tele"
            }, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({
                'message': str(error)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)