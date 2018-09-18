// 对话框排序
export function compare(order, propertyName) {
    return function (obj1, obj2) {
        let val1 = obj1[propertyName]
        let val2 = obj2[propertyName]
        // des：倒序
        // asc：正序
        return order === 'asc' ? (val1 - val2) : (val2 - val1)
    }
}
export function formatTime(dateTimeStamp) {
    // 若是 Linux 9位, 补全为13位
    dateTimeStamp = Number(String(dateTimeStamp).padEnd(13, '0'))
    var result
    var minute = 1000 * 60
    var hour = minute * 60
    // var day = hour * 24
    // var month = day * 30
    var nowTime = new Date()
    var diff_hours = nowTime.getHours()

    // 时间差
    var diffValue = nowTime.getTime() - dateTimeStamp
    if (diffValue < 0) { return }
    var hourC = diffValue / hour

    // 数值补0方法
    var zero = function (value) {
        if (value < 10) {
            return '0' + value
        }
        return value
    }

    var date = new Date(dateTimeStamp)
    var _year = date.getFullYear()
    var _month = zero(date.getMonth() + 1)
    var _day = zero(date.getDate())
    var _week = date.getDay()
    var _hours = zero(date.getHours())
    var _minutes = zero(date.getMinutes())

    var weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    _week = weekday[_week]

    // 根据时间差返回不同时间格式
    if (hourC > 1 * 24 * 30 * 12) {
        result = `${_year}-${_month}-${_day} ${_hours}:${_minutes}`
    } else if (hourC > 6 * 24 + diff_hours) {
        result = `${_month}-${_day} ${_hours}:${_minutes}`
    } else if (hourC > 2 * 24 + diff_hours) {
        result = `${_week} ${_hours}:${_minutes}`
    } else if (hourC > 1 * 24 + diff_hours) {
        result = `前天 ${_hours}:${_minutes}`
    } else if (hourC > diff_hours) {
        result = `昨天 ${_hours}:${_minutes}`
    } else {
        result = `${_hours}:${_minutes}`
    }
    return result
}
