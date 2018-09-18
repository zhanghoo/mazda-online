<template>
    <el-dialog class="drive-dialog" title="" :visible.sync="visible" width="60%">
        <div id="drive">
            <div class="drive-header">
                <img class="header-logo" src="~@/assets/img/drive-logo.png" />
                <div class="header-title">
                    <div class="title-label">查看预约试驾清单</div>
                </div>
                <div class="header-back" @click="visible = false">
                    <div class="back-icon my-icon-back"></div>
                    <div class="back-label">返回列表</div>
                </div>
            </div>
            <div class="drive-content">
                <el-table :data="tableJson" style="width: 100%" fit :header-cell-style="{'text-align': 'center'}" header-cell-class-name="header-label" empty-text="没有更多数据了">
                    <el-table-column align="center" label="姓名" min-width="80">
                        <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="性别" min-width="50">
                        <template slot-scope="scope">
                            <span>{{scope.row.sex}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="手机号" min-width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.mobile}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="车系" min-width="50">
                        <template slot-scope="scope">
                            <span>{{scope.row.product}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="车型" min-width="110">
                        <template slot-scope="scope">
                            <span>{{scope.row.model}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="提交时间" min-width="110">
                        <template slot-scope="scope">
                            <span>{{scope.row.addtime}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="drive-pagination">
                <el-pagination @current-change="handleCurrentChange" :current-page="listQuery.p" :page-size="listQuery.num" layout="total, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </el-dialog>
</template>
<script>
import { getDrive } from '@/api'
export default {
    name: 'drive',
    data() {
        return {
            visible: true,
            tableJson: [],
            listQuery: {
                advisors_id: 16,
                p: 1,
                num: 10
            },
            total: 0
        }
    },
    watch: {
        visible(val) {
            if (!val) {
                this.$emit('close', false)
            }
        }
    },
    mounted() {
        this.getTableList()
    },
    methods: {
        getTableList() {
            getDrive(this.listQuery).then(res => {
                console.log('试驾清单', res)
                if (res.data && res.data.length > 0) {
                    this.tableJson = res.data
                }
                this.total = res.count
            }).catch(err => {
                console.log(err)
            })
        },
        handleCurrentChange(val) {
            this.listQuery.p = val
        }
    }
}
</script>
<style lang='stylus'>
.drive-dialog {
    .el-dialog__header {
        padding: 0;
        .el-dialog__headerbtn {
            display: none;
        }
    }
    .el-dialog__body {
        padding: 0;
        #drive {
            position: relative;
            width: 100%;
            .drive-header {
                width: 100%;
                height: 80px;
                display: flex;
                align-items: center;
                color: #fff;
                padding: 0 22px;
                background: #000;
                .header-logo {
                    width: 60px;
                }
                .header-title {
                    flex-center();
                    flex: 1;
                    .title-label {
                        position: relative;
                        width: fit-content;
                        text-align: center;
                        font-size: 20px;
                        color: #fff;
                        &:before {
                            content: '';
                            position: absolute;
                            left: 0;
                            bottom: -1px;
                            height: 1px;
                            width: 100%;
                            border-bottom: 1px solid #fff;
                        }
                        &:after {
                            content: '';
                            position: absolute;
                            left: 0;
                            bottom: -4px;
                            height: 1px;
                            width: 100%;
                            border-bottom: 1px solid #fff;
                        }
                    }
                }
                .header-back {
                    display: flex;
                    text-align: center;
                    flex-direction: column;
                    cursor: pointer;
                    font-size: 12px;
                    .back-icon {
                        font-size: 24px;
                        margin-bottom: 2px;
                    }
                }
            }
            .drive-content {
                padding: 20px 25px;
                min-height: 400px;
                max-height: 600px;
                overflow-y: auto;
                .header-label {
                    color: #000;
                    border: none;
                }
                .el-table {
                    &::before {
                        background: none;
                    }
                }
                .el-table__empty-text {
                    color: #000;
                }
            }
            .drive-pagination {
                flex-center();
                padding: 20px;
            }
        }
    }
}
@media screen and (max-width: 980px) {
    .drive-dialog {
        overflow: hidden;
        .el-dialog {
            margin-top: 0 !important;
            width: 100% !important;
            height: 100%;
            .el-dialog__body {
                height: 100%;
                #drive {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    .drive-header {
                        padding: 0 toRem(16);
                    }
                    .drive-content {
                        padding: toRem(20) toRem(15);
                        flex: 1;
                        overflow-y: auto;
                    }
                }
            }
        }
    }
}
</style>
