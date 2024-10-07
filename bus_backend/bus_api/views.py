import hashlib
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


class BusProxyView(APIView):
    def get(self, request):
        # 获取前端传递的参数
        params = request.query_params.dict()
        optype = params.get('optype')

        if not optype:
            return Response({'error': 'Missing parameter: optype'}, status=status.HTTP_400_BAD_REQUEST)

        # 添加你的用户名
        uname = '747329069@qq.com'
        params['uname'] = uname

        # 根据optype生成keySecret
        if optype != 'city':
            key = 'c3014a314bb0d784c19a9c6f1ea66972'
            keySecret = hashlib.md5((uname + key + optype).encode('utf-8')).hexdigest()
            params['keySecret'] = keySecret

        # 发送请求到公交API
        try:
            response = requests.get('http://api.wxbus163.cn/z_busapi/BusApi.php', params=params)
            data = response.json()
            logger.debug(f'请求URL: {response.url}')
            logger.debug(f'外部 API 响应状态码: {response.status_code}')
            logger.debug(f'外部 API 响应内容: {response.text}')
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class CityListView(APIView):
    def get(self, request):
        # 获取uname
        uname = '747329069@qq.com'
        optype = 'city'
        # 构造请求参数
        params = {
            'optype': optype,
            'uname': uname
        }
        # 发起请求
        try:
            response = requests.get('http://api.wxbus163.cn/z_busapi/BusApi.php', params=params)
            data = response.json()
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)