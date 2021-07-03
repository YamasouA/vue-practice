var STORAGE_KEY = 'todos-vuejs-demo'
var todoStorage = {
    fetch: function () {
        var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
        todos.forEach(function(todo, index) {
            todo.id = index
        }) 
        todoStorage.uid = todos.length
        return todos
    },
    save: function(todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    }
}


schedule = []
new Vue({
    el: '#app',

    data: {
        showContent: false,
        // 状態を表示に利用
        cnt: 0,

        // modalでメモを表示する用（クリックイベントで代入)
        index: 0,

        start: '',
        end: '',


        // 
        isModalActive: false,

        // localStorageから取得したToDoのリスト
        todos: [],

        // modalのメモをそれぞれで保持する
        memos: [],

        // 抽出しているToDoの状態
        current: -1,
        // 各状態のラベル
        options: [
            { value: 0, label: '全て'},
            { value: 1, label: '選考中'},
            { value: 2, label: 'お祈り'},
            { value: 3, label: '内定'},
        ]
    },
    computed: {
        computedTodos: function() {
            return this.todos.filter(function (el) {
                return this.current < 0 ? true: this.current === el.state
            }, this)
        },
        labels() {
            return this.options.reduce(function(a, b) {
                return Object.assign(a, {[b.value]: b.label})
            }, {})
            // キーから見つけやすいように、次のように加工したデータを作成
            // {0: '作業中', 1: '完了', -1: 'すべて'}
        }
    },

    watch: {
        todos: {
            handler: function(todos) {
                todoStorage.save(todos)
            },
            deep: true
        }
    },

    created() {
        this.todos = todoStorage.fetch()
    },

    methods: {

        /**
         * clickイベントが発火したタイミングで、
         * オーバーレイコンテンツを表示するフラグを持つデータを切り替える
         */
        openItem() {
            this.toggleModal();
        },
        /**
         * active状態を切り替える
         */
        toggleModal() {
            this.isModalActive != this.isModalActive;
        },

        // ToDo追加の処理
        doAdd: function(event, value) {
            // refで名前をつけた要素を参照
            var comment = this.$refs.comment
            // 入力がなければそのままreturn
            if (!comment.value.length) {
                return
            }
            this.todos.push({
                id: todoStorage.uid++,
                comment: comment.value,
                start: "",
                end: "",
                state: 0
            })
            // 空白のメモを作成
            this.memos.push([])
            console.log(this.memos)

            comment.value = ''
        },
        // 状態変更の処理
        doChangeState: function(item) {
            item.state = this.cnt % 4,
            this.cnt++
        },

        // 削除の処理
        doRemove: function (item) {
            var index = this.todos.indexOf(item)
            console.log(index)
            this.todos.splice(index, 1)
            this.memos.splice(index, 1)
            console.log(this.memos)
        },

        //addCalendar: function() {
        //    schedule.append([this.start, this.end])
        //},
        wow: function(corName) {
            schedule.push([this.start, this.end, corName])
            console.log(schedule)
        },
        
        openModal: function(item) {
            console.log(this.showContent)
            this.showContent = !this.showContent
            this.index = this.todos.indexOf(item)
            console.log(this.index)
            console.log(this.showContent)
        },
        closeModal: function() {
            this.showContent = !this.showContent
            this.index = 0
        }
    }
})


let weeks = ['日', '月', '火', '水', '木', '金', '土']
let date = new Date()
let year = date.getFullYear()
let month = date.getMonth() + 1
checkString = ""
var makeCalendar = {
    showCalendar: function(year, month) {
        this.calendarHtml = this.createCalendar(year, month)
        sec = document.createElement('section')
        sec.innerHTML = this.calendarHtml
        document.querySelector('#calendar').appendChild(sec)
        month++
        if (month > 12) {
            year++
            month = 1
        }
        console.log(document)
        return sec
    },

    createCalendar: function(year, month) {
        startDate = new Date(year, month-1, 1)
        endDate = new Date(year, month, 0)
        endDayCount = endDate.getDate()
        lastMonthEndDate = new Date(year, month-1, 0)
        lastMonthendDayCount = lastMonthEndDate.getDate()
        startDay = startDate.getDay()
        dayCount = 1
        //eventStart = document.getElementById('startday').value
        //eventEnd = document.getElementById('endday').value
        //console.log(eventStart)
        //console.log(eventEnd)
        calendarHtml = '<h1>' + year + '/' + month + '</h1>'
        calendarHtml += '<table>'

        for (i=0; i<weeks.length; i++) {
            calendarHtml += '<td id="yobi">' + weeks[i] + '</td>'
        }

        for (w=0; w<5; w++) {
            
            calendarHtml += '<tr>'
            for(d=0; d<7; d++) {
                checkString = String(year) + '-' 
                if(w==0 && d<startDay) {
                    if (month-1 < 10) {
                        checkString += '0'
                    } 
                    checkString += String(month-1) + '-'
                    num = lastMonthendDayCount - startDay + d + 1
                    if(num < 10) {
                        checkString += '0'
                    }
                    checkString += String(num)
                    calendarHtml += '<td class="is-disabled">' + num + '</td>'
                    for(i=0; i<schedule.length; i++) {
                        if (schedule[i][0] === checkString) {
                            calendarHtml += '<td>' + schedule[i][2] + '</td>'
                        }
                    }
                } else if(dayCount > endDayCount) {
                    if (month < 10) {
                        checkString += '0'
                    }
                    checkString += String(month) + '-'
                    num = dayCount - endDayCount
                    if (num < 10){
                        checkString += '0'
                    }
                    checkString += String(num)
                    calendarHtml += '<td class="is-disabled">' + num + '</td>'
                    for(i=0; i<schedule.length; i++) {
                        if (schedule[i][0] === checkString) {
                            console.log("Jaaaaaa")
                            calendarHtml += '<td>' + schedule[i][2] + '</td>'
                        }
                    }
                    dayCount++
                } else {
                    if(month < 10) {
                        checkString += '0'
                    }
                    checkString += String(month) + '-'
                    if(dayCount < 10) {
                        checkString += '0'
                    }
                    checkString += String(dayCount)
                    calendarHtml += '<td>' + dayCount  + '</td>'
                    for(i=0; i<schedule.length; i++) {
                        if (schedule[i][0] === checkString) {
                            console.log("afjowejfgowgjo")
                            calendarHtml +=  '<td>' + schedule[i][2] + '</td>'
                        }
                    }
                    dayCount++
                }
                console.log(checkString)
            }
            calendarHtml += '</tr>'
        }
        calendarHtml += '</table>'
        return calendarHtml
    },

    addEvent: function(item) {
        return 0;
    }
};




calendarComp= makeCalendar.showCalendar(year, month),
calendar = new Vue({
    el: '#calendar',

    methods: {
        prev: function(){
            month--
            console.log(month)
            console.log(document.querySelector('#calendar').lastChild)
            document.querySelector('#calendar').removeChild(document.querySelector('#calendar').lastChild)
            calendarComp = makeCalendar.showCalendar(year, month)
            
        },
        next: function() {
            month++
            console.log(month)
            document.querySelector('#calendar').removeChild(document.querySelector('#calendar').lastChild)
            calendarComp = makeCalendar.showCalendar(year, month)
        }
    },

})