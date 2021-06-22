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

new Vue({
    el: '#app',

    data: {
        // localStorageから取得したToDoのリスト
        todos: [],
        // 抽出しているToDoの状態
        current: -1,
        // 各状態のラベル
        options: [
            { value: -1, label: 'すべて'},
            { value: 0, label: '作業中'},
            { value: 1, label: '完了'},
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
                state: 0
            })
            comment.value = ''
        },
        // 状態変更の処理
        doChangeState: function(item) {
            item.state = !item.state ? 1: 0
        },

        // 削除の処理
        doRemove: function (item) {
            var index = this.todos.indexOf(item)
            this.todos.splice(index, 1)
        }
    }
})