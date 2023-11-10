import axios from 'axios';
import { GET_AUDIO_TRANSCRIPTIONS } from '../repository/routes';

export const fetchActivities = async (start: any, end: any) => {
  const res = await axios.get(`${GET_AUDIO_TRANSCRIPTIONS}?skip=${start}&limit=${end}`);
  return res.data;
};
