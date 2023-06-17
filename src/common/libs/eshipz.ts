import axios from 'axios';

export const getToken = () => {
  return '625004700afce0730dfda07a';
};

export const getDetailsViaWaybill = async (waybillNo: string | number) => {
  const token = getToken();
  const { data } = await axios({
    method: 'POST',
    url: `https://app.eshipz.com/api/v1/trackings`,
    headers: {
      accept: '*/*',
      'X-API-TOKEN': token,
    },
    data: {
      q_num: waybillNo,
    },
  });

  return data;
};
