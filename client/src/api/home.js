import request from "@/utils/request";
import { typeMap, statusMap } from '@/contants/itemMap'

// 获取轮播图数据
export const getBanners = () => request.get('/api/banner', { baseURL: ''});

// 获取物品数据 （失物招领和物品遗失）并进行数据清洗
export const getItems = async () => {
  const res = await request.get('/item/getItemList', {
  })

  const list = res.data
  const newList = list.map(item => {
    return {
      ...item,
      typeText: typeMap[item.type],
      statusText: statusMap[item.status]
    }
  })
  return newList
}

// 根据物品id获取物品详情
export const getItemDetail = async (id) => {
  const res = await request.get(`/item/getItemInfoById/${id}`, {
    params: { id },
  })
  return res.data
}

// 根据物品分类树获取物品信息
export const getItemsByCategoryId = (params) => request.get('/item/getItemsByCategoryId', {params})

// 根据物品名称模糊查询物品信息
export const getItemsByName = (params) => request.get('/item/searchItem', {params})
