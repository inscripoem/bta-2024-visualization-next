"use client";

import { useEffect, useState } from "react";

interface SchoolData {
  name: string;
  location: string;
  vote_count: number;
}

interface SchoolAvg {
  school_name: string;
  avg: number;
  nonzero_avg: number;
}

interface TotalAvg {
  avg: number;
  nonzero_avg: number;
}

export interface Work {
  title: string;
  total_avg: TotalAvg;
  total_school_avg: TotalAvg;
  school_avg: SchoolAvg[];
}

interface Award {
  name: string;
  works: Work[];
}

interface VoteData {
  stats: {
    total_school_count: number;
    total_vote_count: number;
  };
  schools: SchoolData[];
  awards: Award[];
}

// 缓存相关的常量
const CACHE_KEY = 'vote_data_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1小时的缓存时间

// 开发选项
const DEV_OPTIONS = {
  // 是否禁用缓存
  DISABLE_CACHE: false,
}

export function useVoteData() {
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
  const [awards, setAwards] = useState<Award[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 尝试从缓存获取数据
    const getCachedData = () => {
      if (DEV_OPTIONS.DISABLE_CACHE) {
        return null;
      }
      
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // 检查缓存是否过期
          if (Date.now() - timestamp < CACHE_DURATION) {
            return data;
          }
        }
      } catch (err) {
        console.warn('Error reading from cache:', err);
      }
      return null;
    };

    // 从服务器获取数据并更新缓存
    const fetchAndCacheData = async () => {
      try {
        const res = await fetch("/api/data");
        const data: VoteData = await res.json();
        // 更新缓存
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        return data;
      } catch (err) {
        console.error("Failed to fetch vote data:", err);
        throw err;
      }
    };

    // 主要的数据获取逻辑
    const loadData = async () => {
      try {
        // 先尝试从缓存获取
        const cachedData = getCachedData();
        if (cachedData) {
          setSchoolData(cachedData.schools);
          setAwards(cachedData.awards);
          setLoading(false);
          return;
        }
        
        // 从服务器获取数据
        const data = await fetchAndCacheData();
        setSchoolData(data.schools);
        setAwards(data.awards);
        setLoading(false);
      } catch (err) {
        setError("Failed to load data: " + err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { schoolData, awards, error, loading };
}