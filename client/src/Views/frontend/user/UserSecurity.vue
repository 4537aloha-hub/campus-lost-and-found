<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const changePwd = () => {
  router.push({ name: 'verifypwdemail' });
}
const changeInfo = () => {
  router.push({ name: 'edituserinfo' });
}

const changeEmail = () => {
  router.push({ name: 'verifyoldemail' });
}
</script>
<template>
<div class="container">
  <div class="security">
    <div class="security-card">
        <div class="security-info">
          <div class="security-content">绑定邮箱</div>
          <div class="security-button" @click="changeEmail">去绑定</div>
        </div>
    </div>
      <div class="security-card">
        <div class="security-info">
          <div class="security-content">设定密码</div>
          <div class="security-button" @click="changePwd">去修改</div>
        </div>
    </div>
        <div class="security-card">
        <div class="security-info">
          <div class="security-content">个人资料</div>
          <div class="security-button" @click="changeInfo">修改资料</div>
        </div>
    </div>
  </div>
</div>
</template>
<style scoped lang="scss">
.container {
  background: #fff;
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  max-width: 1240px;
  .security-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    }
    .security {
      width: 600px;
      margin: 28px auto 0;

      .security-card {
        margin-top: 20px;
        position: relative;
        box-sizing: border-box;
        height: 87px;
        background: #fff;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        border-radius: 8px;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, .06);
        .security-icon {
          width: 24px;
          height: 24px;
        }
        .security-info {
              margin-left: 12px;
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: space-between;
                .security-content {
                  font-family: PingFang SC;
                  font-style: normal;
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 20px;
                  color: #18191c;
                  margin-bottom: 2px;
                }
                .security-button {
                  width: 88px;
                  height: 30px;
                  box-sizing: border-box;
                  text-align: center;
                  line-height: 30px;
                  font-weight: 400;
                  font-size: 14px;
                  cursor: pointer;
                  border-radius: 15px;
                  color: #61666d;
                  border: 1px solid #c9ccd0;
                }
              }
            }
          }
        }
</style>
