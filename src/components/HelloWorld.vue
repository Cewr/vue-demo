<template>
  <div class="root">
    <div class="header">ZTE SO</div>
    <el-input v-model="input" size="large" clearable @keyup.enter='fetchApi' :placeholder="{
      getDomains: '逗号或空格分隔多个公司名称',
      domain2all: '输入单个域名',
      company2all: '输入单个公司名称',
    }[select]" class="input-with-select">
      <template #prepend>
        <el-select v-model="select" size="large" placeholder="Select" style="width: 120px">
          <el-option label="公司域名" value="getDomains" />
          <el-option label="域名查询" value="domain2all" />
          <el-option label="公司查询" value="company2all" />
        </el-select>
      </template>
      <template #append>
        <el-button :icon="Search" plain @click="fetchApi" size="large" class="submit-btn" />
      </template>
    </el-input>


    <div class="main-container" v-loading="loading">
      <div class="main-content">
        <el-scrollbar height="511px" always>

          <div class="code-field">
            <div class="unfold-list">
              <div class="unfold" v-for="val in JSON.stringify(result, null, 4).split(/\n/)">
                <el-icon
                  :class="(val?.replace(/[^\{\}\[\]]/g, '').length === 1 && val?.replace(/\s/g, '').length > 2) || val.includes('...') ? 'show' : 'hide'"
                  @click="onUnfold(val)">
                  <ArrowDown :class="val.includes('...') ? 'rotate' : ''" />
                </el-icon>
              </div>
            </div>

            <pre class="pre-code"><code>{{ JSON.stringify(result, null, 4).replace(/"..."/g, '...') }}</code></pre>
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
import { Search, Download, CopyDocument, ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { downloadTxt, copy } from '../common/utils'
import moment from 'moment'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      input: '',
      select: 'getDomains',

      loading: false,

      resultOrigin: {},
      result: {},
      activeTags: []
    }
  },
  components: { Download, CopyDocument, ArrowDown },
  setup: () => ({
    Search
  }),
  methods: {
    fetchApi: function () {
      const { input, loading, select } = this;
      if (!input || loading) return;
      this.loading = true;

      let url = select;
      let value = input;

      if (url === 'getDomains') {
        const ls = value.split(/[\s,\uff0c]/).filter((i) => !!i);
        if (ls.length > 1) {
          value = ls.join()
        } else {
          url = 'getDomain'
        }
      }

      const key = {
        getDomains: 'entnames',
        getDomain: 'entname',
        domain2all: 'domain',
        company2all: 'entname'
      }[url]



      fetch(`http://49.235.105.117:8081/${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify({
          [key]: value,
        })
      }).then(res => res.json()).then(res => {
        this.resultOrigin = JSON.parse(JSON.stringify(res));
        this.result = res;
      })
        .catch((e) => {
          console.log('e>>>>>', e)
          ElMessage.error('获取失败，请重试')
        })
        .finally(() => {
          this.loading = false
        });
    },
    onCopy: function () {
      const text = JSON.stringify(this.result, null, 4);
      copy(text).then(() => {
        ElMessage.success('Copy successful')
      }).catch(() => {
        ElMessage.error('Copy failed')
      })
    },
    onDownload: function () {
      const text = JSON.stringify(this.result, null, 4);
      downloadTxt(moment(new Date()).format('YY-MM-DD_hh-mm_s'), text);
    },
    onUnfold: function (val) {
      const key = val.replace(/[":,\s\[\{]/g, '')
      if (key.includes('...')) {
        const key2 = key.replace('...', '')
        this.result[key2] = this.resultOrigin[key2]
      } else {
        this.result[key] = '...'
      }
    }
  }
}

</script>

<style scoped lang="less">
.root {
  width: 1000px;
  height: 732px;
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
    font-size: 50px;
    color: #008fd5;
    line-height: 100px;
  }

  .input-with-select {
    width: 100%;

    .submit-btn {
      width: 100px;
      color: #777;
    }
  }

  .main-container {
    border: 1px solid #dcdfe6;
    margin: 15px 0;
    height: 580px;
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
      background: #f6f8fa;
      border-radius: 10px;

      .el-scrollbar {
        padding-right: 15px;

        .code-field {
          display: flex;

          .unfold-list {
            width: 15px;
            padding: 0 8px;

            .unfold {
              height: 15px;
              font-size: 15px;
              color: #409eff;

              .show {
                cursor: pointer;

                .rotate {
                  transform: rotate(-90deg);
                  color: #067ffb;
                }
              }

              .hide {
                opacity: 0;
              }
            }
          }

          .pre-code {
            flex: 1;
            text-align: left;
            white-space: pre-wrap;
            margin: 0;
          }
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
