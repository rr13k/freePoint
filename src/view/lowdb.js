class Rectangle {
    constructor() {
      this.db = this.dbInit()
    }

    get area() {
        return this.calcArea()
    }

    get getdb(){
        return this.db
    }

    get dbUpdate(){
        this.db  =  this.dbInit()
    }
    
    test(){
       return this.getProjeIdAdd()
    }

    getProjeIdAdd(){
        return  this.db.update('projectsConts', n => n + 1).write().projectsConts
    }

    getCaseAdd(){
        return  this.db.update('casesConts', n => n + 1).write().casesConts
    }

    getProjectChild(id){
        return this.db.get('projects')
            .filter({father:id})
            .value()
    }

    saveCase(cmdList,url,projectId){
        let num = this.getCaseAdd()
        this.db.get('cases')
            .push({"id": num,"label":"new case","caseCMD": cmdList, "testURL":url,"project":projectId,"runNum":0,
              "success":0,"error":0})
            .write()
    }

    getCaseData(id){
        return this.db.get('cases')
            .filter({project:id})
            .value()
    }

    dbInit(){  //get 为value
        var lowdb = require('lowdb')
        var FileSync = require('lowdb/adapters/FileSync');  // 有多种适配器可选择
        var adapter = new FileSync('db.json'); // 申明一个适配器
        lowdb = lowdb(adapter)  // 以上初始化数据库
        lowdb.defaults({projects:[],projectsConts:0,casesConts:0,cases:[]}).write(); //初始化数据表格
        return  lowdb
    }

    addInitProject(id = false){
        let  num = this.getProjeIdAdd()
        let addStr =  {"label":'文件'+ num,"type":"projects","father": id,"children":[],"id":num}
        this.db.get('projects')
            .push(addStr)
            .write()
        return addStr
    }

    addInitCase(id){
        let num = this.getProjeIdAdd()
        let addStr = { "label": "用例集", "type": "cases","father": id, "children": [], "id": num }
        this.db.get('projects')
            .push(addStr)
            .write()
    }

    addInitCookie(id){
        var num = this.getProjeIdAdd()
        let addStr = { "label": "cookie配置", "father": id,"type": "requestHd", "id": num }
        this.db.get('projects')
            .push(addStr)
            .write()
    }

    deleteProjects(id){
        this.db.get('projects')
            .remove({id: id})
            .write()
    }

    initProjectData(){  //初始化项目表的数据
        let data =  this.db.get('projects')
                        .filter({father: false})
                        .value()
        return data
    }

    // Method
    calcArea() {
        return this.height * this.width;
    }
    
    get area2(){
        return  123
    }
    
  }


//   module.exports.ss = ss;
module.exports.lowdb =  Rectangle;
