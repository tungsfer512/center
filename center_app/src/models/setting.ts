import { data } from '@/utils/data';
import { useState } from "react";
import {
  get_auto_agent,
  update_auto_agent,
  stop_auto_agent,
  get_auto_agent_click,
} from "@/services/Setting/autoagent";

import {
  get_auto_blacklist,
  update_auto_blacklist,
  stop_auto_blacklist,
  get_auto_blacklist_click,
  get_srcs_blacklist,
} from "@/services/Setting/autoblacklist";

import {
  get_auto_whitelist,
  update_auto_whitelist,
  stop_auto_whitelist,
  get_auto_whitelist_click,
  get_srcs_whitelist,
} from "@/services/Setting/autowhitelist";
import { message } from "antd";

export interface ISrc {
  id: number;
  url: string;
  src_type: string;
  file_type: string;
}

export default () => {
  const [loading, setLoading] = useState<boolean[]>(
    new Array(3).fill(false)
  );
  const [timeAgent, setTimeAgent] = useState<any>(-1); // eslint-disable-line
  const [timeBlacklist, setTimeBlacklist] = useState<any>(-1); // eslint-disable-line
  const [timeWhitelist, setTimeWhitelist] = useState<any>(-1); // eslint-disable-line

  const [srcsBlacklist, setSrcsBlacklist] = useState<ISrc[]>([]);
  const [srcsWhitelist, setSrcsWhitelist] = useState<ISrc[]>([]);

  const [dataAutoAgent, setDatatAutoAgent] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [dataAutoBlacklist, setDatatAutoBlacklist] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [dataAutoWhitelist, setDatatAutoWhitelist] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const getDataAutoTime = (time: number) => {
    console.log(time);
    if (time === -1) return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    if (time >= 86400) {
      days = Math.floor(time / 86400);
      time = time - days * 86400;
      if (time >= 3600) {
        hours = Math.floor(time / 3600);
        time = time - hours * 3600;
        if (time >= 60) {
          minutes = Math.floor(time / 60);
          time = time - minutes * 60;
          seconds = time;
        }
      }
    }
    const data = {
      days,
      hours,
      minutes,
      seconds,
    };

    return data;
  }

  const getAutoAgentClick = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 0 ? true : item)));
      const response = await get_auto_agent_click();
      if (response.status) {
        message.success('Cập nhật thành công')
      }
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
      console.log(response);
      return response;
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
      message.error('Lỗi thực hiện')
    }
    return undefined;
  }

  const getAutoAgent = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 0 ? true : item)));
      const response = await get_auto_agent().then((res) => {
        console.log(res);
        setTimeAgent(res?.data);
        console.log(Number(res?.data));
        setDatatAutoAgent(getDataAutoTime(Number(res?.data)));
        setLoading(loading.map((item, index) => (index === 1 ? false : item)));
        console.log(dataAutoAgent);
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
      setTimeAgent(-1);
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const updateAutoAgent = async (time: number) => {
    try {
      setLoading(loading.map((item, index) => (index === 0 ? true : item)));
      const response = await update_auto_agent(time);
      console.log(response.data);
      // setTimeAgent(response.data);
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
      // setTimeAgent(-1);
    }
  }

  const stopAgent = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 0 ? true : item)));
      const response = await stop_auto_agent();
      console.log(response);
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 0 ? false : item)));
    }
  }



  const getAutoBlacklistClick = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await get_auto_blacklist_click();
      if (response.status) {
        message.success('Cập nhật thành công')
      }
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      console.log(response);
      return response;
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      message.error('Lỗi thực hiện')
    }
    return undefined;
  }

  const getSrcsBlacklist = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await get_srcs_blacklist().then((res) => {
        console.log(res?.data?.data);
        setSrcsBlacklist(res?.data?.data);
        setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
    }
  }

  const getAutoBlacklist = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await get_auto_blacklist().then((res) => {
        console.log(res);
        setTimeBlacklist(res?.data);
        console.log(Number(res?.data));
        setDatatAutoBlacklist(getDataAutoTime(Number(res?.data)));
        setLoading(loading.map((item, index) => (index === 1 ? false : item)));
        console.log(dataAutoBlacklist);
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      setTimeBlacklist(-1);
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const updateAutoBlacklist = async (time: number) => {
    try {
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await update_auto_blacklist(time);
      console.log(response.data);
      // setTimeBlacklist(response.data);
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
      // setTimeBlacklist(-1);
    }
  }

  const stopBlacklist = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 1 ? true : item)));
      const response = await stop_auto_blacklist();
      console.log(response);
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 1 ? false : item)));
    }
  }

  const getAutoWhitelist = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 2 ? true : item)));
      const response = await get_auto_whitelist().then((res) => {
        console.log(res);
        setTimeWhitelist(res?.data);
        console.log(Number(res?.data));
        setDatatAutoWhitelist(getDataAutoTime(Number(res?.data)));
        setLoading(loading.map((item, index) => (index === 1 ? false : item)));
        console.log(dataAutoWhitelist);
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
      setTimeWhitelist(-1);
    }
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const getSrcsWhitelist = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 2 ? true : item)));
      const response = await get_srcs_whitelist().then((res) => {
        console.log(res);
        setSrcsWhitelist(res?.data?.data);
        setLoading(loading.map((item, index) => (index === 2 ? false : item)));
      });
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
    }
  }

  const getAutoWhitelistClick = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 2 ? true : item)));
      const response = await get_auto_whitelist_click();
      if (response.status) {
        message.success('Cập nhật thành công')
      }
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
      console.log(response);
      return response;
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
      message.error('Lỗi thực hiện')
    }
    return undefined;
  }

  const updateAutoWhitelist = async (time: number) => {
    try {
      setLoading(loading.map((item, index) => (index === 2 ? true : item)));
      const response = await update_auto_whitelist(time);
      console.log(response.data);
      // setTimeWhitelist(response.data);
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
      // setTimeWhitelist(-1);
    }
  }

  const stopWhitelist = async () => {
    try {
      setLoading(loading.map((item, index) => (index === 2 ? true : item)));
      const response = await stop_auto_whitelist();
      console.log(response);
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
    } catch (error) {
      setLoading(loading.map((item, index) => (index === 2 ? false : item)));
    }
  }

  return {
    loading,
    setLoading,

    timeAgent,
    setTimeAgent,
    dataAutoAgent,
    getDataAutoTime,
    getAutoAgent,
    updateAutoAgent,
    stopAgent,
    getAutoAgentClick,

    timeBlacklist,
    setTimeBlacklist,
    dataAutoBlacklist,
    getAutoBlacklist,
    updateAutoBlacklist,
    stopBlacklist,
    getAutoBlacklistClick,
    srcsBlacklist,
    getSrcsBlacklist,

    timeWhitelist,
    setTimeWhitelist,
    dataAutoWhitelist,
    getAutoWhitelist,
    updateAutoWhitelist,
    stopWhitelist,
    getAutoWhitelistClick,
    srcsWhitelist,
    getSrcsWhitelist,
  };
};
