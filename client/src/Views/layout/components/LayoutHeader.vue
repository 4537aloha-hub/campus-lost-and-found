<script setup>
</script>
<template>
  <header class="layout-header">
    <div class="container">
      <h1 class="logo">
        <RouterLink to="/">校园失物招领系统</RouterLink>
      </h1>
      <ul class="layout-nav">
        <li><RouterLink to="/" >首页</RouterLink></li>
        <li><RouterLink to="/lost" >失物中心</RouterLink></li>
        <li><RouterLink to="/publish" >失物招领</RouterLink></li>
        <li><RouterLink to="/userlayoutcontainer" >我的</RouterLink></li>
      </ul>
    </div>
  </header>
</template>
<style scoped lang="scss">
.layout-header {
  width: 100%;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 16px;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-sizing: border-box;
    }
    .logo {
      margin-right: 24px;
      a {
        font-size: 20px;
        color: #000;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .layout-nav {
      display: flex;
      flex: 1;
      gap: 16px;

      a.router-link-exact-active {
        color: #4791e7;
        border-bottom: 1px solid #4791e7;
      }

      li {
        list-style: none;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
      }
      a {
        font-size: 16px;
        line-height: 32px;
        color: #000;
        text-decoration: none;
        display: inline-block;

        &:hover {
          color: #4791e7;
          border-bottom: 1px solid #4791e7;
        }

        &.active {
          color: #4791e7;
          border-bottom: 1px solid #4791e7;
        }
      }
    }
    .search {
      margin-right: 12px;
      input {
        width: 170px;
        height: 32px;
        padding: 0 12px;
        border: 1px solid #ccc;
        border-radius: 20px;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #4791e7;
          width: 200px;
        }
      }
    }
    button {
      padding: 0 16px;
      height: 32px;
      border: none;
      border-radius: 20px;
      background-color: #4791e7;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #3a7bc8;
      }
    }

  // 响应式设计
  @media (max-width: 1024px) {
    .container {
      padding: 0 12px;
    }
    .logo {
      margin-right: 16px;
      a {
        font-size: 18px;
      }
    }
    .layout-nav {
      gap: 12px;
      a {
        font-size: 15px;
      }
    }
    .search input {
      width: 150px;

      &:focus {
        width: 180px;
      }
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 10px;
    }
    .logo {
      margin-right: 12px;
      a {
        font-size: 16px;
      }
    }
    .layout-nav {
      gap: 8px;
      a {
        font-size: 14px;
      }
    }
    .search input {
      width: 130px;

      &:focus {
        width: 150px;
      }
    }
    button {
      padding: 0 12px;
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    height: auto;
    min-height: 60px;
    padding: 8px 0;

    .container {
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }
    .logo {
      margin-right: 0;
      flex: 1;
      text-align: center;
    }
    .layout-nav {
      order: 3;
      width: 100%;
      justify-content: center;
      gap: 12px;
    }
    .search {
      margin-right: 8px;
    }
    .search input {
      width: 120px;

      &:focus {
        width: 140px;
      }
    }
  }
}


</style>
