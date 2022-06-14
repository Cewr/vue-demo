<template>
  <div class="root">
    <div class="header">ZTE SO</div>
    <el-input v-model="input" size="large" clearable @keyup.enter='fetchApi(input)' placeholder="任意符号分隔多个"
      class="input-with-select">
      <template #prepend>
        <el-select v-model="select" size="large" placeholder="Select" style="width: 100px">
          <el-option label="公司" value="1" />
          <el-option label="部门" value="2" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" plain @click="fetchApi(input)" size="large" class="submit-btn" />
      </template>
    </el-input>

    <div class="main-container" v-loading="loading">
      <div class="main-content">
        <el-scrollbar height="421px" always>
          <div class="list-collapse">
            <el-collapse v-for="key in Object.keys(result)" v-model="activeTags">
              <el-collapse-item :title="key" :name="key">
                <el-tag class="item-tag" v-for="tag in result[key]">{{ tag }}</el-tag>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-scrollbar>
      </div>

      <div class="main-footer">
        <el-tooltip class="box-item" effect="dark" content="下载为 json" placement="top-end">
          <el-button link type="" @click="onDownload()">
            <el-icon style="font-size: 17px">
              <Download />
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="复制到粘贴板" placement="top-start">
          <el-button link type="" @click="onCopy()">
            <el-icon>
              <CopyDocument />
            </el-icon>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs';
import { Search, Download, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { downloadTxt, copy, strSplit } from '../common/utils'
import moment from 'moment'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      input: '',
      select: '1',

      loading: false,

      result: {},
      activeTags: []
    }
  },
  components: { Download, CopyDocument },
  setup: () => ({
    Search
  }),
  methods: {
    fetchApi: function (name) {
      const ls = strSplit(name);
      if (!ls.length || this.loading) return;
      this.loading = true;

      fetch(`http://49.235.105.117:8081/getDomain${ls.length === 1 ? '' : 's'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
          [`entname${ls.length === 1 ? '' : 's'}`]: ls.join(),
        })
      }).then(res => res.json()).then(res => {
        this.result = res;
        this.activeTags = ls;
      })
        .catch(() => {
          ElMessage.error('获取失败，请重试')
        })
        .finally(() => {
          this.loading = false
        });
    },
    onCopy: function () {
      const text = JSON.stringify(this.result);
      copy(text).then(() => {
        ElMessage.success('Copy successful')
      }).catch(() => {
        ElMessage.error('Copy failed')
      })
    },
    onDownload: function () {
      const text = JSON.stringify(this.result);
      downloadTxt(moment(new Date()).format('YY-MM-DD_hh-mm_s'), text);
    }
  }
}

</script>

<style scoped lang="less">
.root {
  width: 1000px;
  height: 672px;
  max-width: 85vw;
  max-height: 90vh;
  position: fixed;
  top: -100px;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;

  .header {
    font-weight: bold;
    font-size: 40px;
    line-height: 100px;
  }

  .input-with-select {
    width: 100%;

    .submit-btn {
      width: 80px;
      color: #777;
    }
  }

  .main-container {
    border: 1px solid #dcdfe6;
    margin: 15px 0;
    height: 500px;
    border-radius: 10px;
    position: relative;
    display: flex;
    flex-direction: column;

    .item-tag {
      margin: 3px;
    }

    .main-content {
      flex: 1;
      padding: 15px 0px 10px;

      .el-scrollbar {
        padding: 0 15px;

        .item-title {
          text-align: left;
          padding-bottom: 5px;
          font-size: 15px;
        }

        .el-empty {
          height: 100%;
        }
      }
    }

    .main-footer {
      height: 48px;
      border-top: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0 30px;

      i {
        margin: 0 5px;
        font-size: 16px;
        color: #555;
      }
    }
  }
}
</style>
