export default [{
  url:'/api/banner',
  method:'get',
  response: () => {
    return {
      code:200,
      message:"获取轮播图数据成功",
      data:[
        {
          id:1001,
          imgUrl:"https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
        },
        {
          id:1002,
          imgUrl:"https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
        },
        {
          id:1003,
          imgUrl:"https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
        },
        {
          id:1004,
          imgUrl:"https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
        }
      ]
    }
  }
}]
