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
        showContent: false,
        // 状態を表示に利用
        cnt: 0,
        //
        isModalActive: false,

        // localStorageから取得したToDoのリスト
        todos: [],
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
                state: 0
            })
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
            this.todos.splice(index, 1)
        },


        
        openModal: function() {
            this.showContent = true
        },
        closeModal: function() {
            this.showContent = false
        }
    }
})

