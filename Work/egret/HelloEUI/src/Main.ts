//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
    private myGroupmain: eui.Group;
    private Question: Array<string>;
    private Questions: Array<Array<string>>;
    private results: Array<string>;
    private Scores: Array<Array<number>>;
    private rdb1: eui.RadioButton;
    private rdb2: eui.RadioButton;
    private rdb3: eui.RadioButton;
    private rdb4: eui.RadioButton;
    private QuestionCount = 0;
    private Score = 0;
    private lb: eui.Label;
    private lbresult: eui.Label;
    private button: eui.Button;
    private radioGroup: eui.RadioButtonGroup = new eui.RadioButtonGroup();
    private resultlb: eui.Label;
    protected createChildren(): void {
        super.createChildren();
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        this.stage.registerImplementation("eui.IAssetAdapter",assetAdapter);
        this.stage.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        var theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload");
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private createScene(){
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        
//        console.log("createGameScene",RES.getRes("laugh_raise_png"));
//        var laughpic: egret.Bitmap = new egret.Bitmap(RES.getRes("laugh_raise_png"));
//        this.addChild(laughpic);
        
            this.Questions = this.initQuestions();
            this.Scores = this.initScores();
            this.results = this.initResults();
            
            this.Question = this.Questions[0];

            this.initmyGroupmain();


            this.initLable(this.myGroupmain,this.Question);
            this.initRadioButtonWithGroup(this.myGroupmain,this.Question);
            this.initButton(this.myGroupmain);

            this.addChild(this.myGroupmain);
        
        
        

        
        
        
        
        
        
    }
    private initmyGroupmain():void{
        this.myGroupmain = new eui.Group();
        this.myGroupmain.width = 500;
        this.myGroupmain.height = 600;
        this.myGroupmain.layout = this.initvLayout();
    }
    
    
    private inithLayout():eui.HorizontalLayout{
        var hLayout: eui.HorizontalLayout = new eui.HorizontalLayout();
        hLayout.gap = 10;
        hLayout.paddingTop = 30;
        hLayout.horizontalAlign = egret.HorizontalAlign.CENTER;
        return hLayout;
    }
    private initvLayout():eui.VerticalLayout{
        var vLayout: eui.VerticalLayout = new eui.VerticalLayout();
        vLayout.gap = 30;
        vLayout.paddingTop = 30;
        vLayout.horizontalAlign = egret.HorizontalAlign.LEFT;
        return vLayout;
    }
    private initLable(group: eui.Group,question: Array<string>):void{
        this.lb = new eui.Label();
        var Question: Array<string> = question;
        this.lb.text = this.Question[0];
        group.addChild(this.lb);
    }
    
    private changeLable(group: eui.Group,question: Array<string>): void {
        group.removeChild(this.lb);
        this.lb = new eui.Label();
        this.lb.text = this.Question[0];
        group.addChild(this.lb);
    }
    
    private initRadioButtonWithGroup(group:eui.Group,question :Array<string>):void{
        
        this.radioGroup.addEventListener(eui.UIEvent.CHANGE,this.radioChangeHandler,this);
        var Question:Array<string> = question;
        this.rdb1 = new eui.RadioButton();
        this.rdb1.label = this.Question[1];
        this.rdb1.value = 1;
        this.rdb1.group = this.radioGroup;
        group.addChild(this.rdb1);
        this.rdb2 = new eui.RadioButton();
        this.rdb2.label = this.Question[2];
        this.rdb2.value = 2;
        this.rdb2.group = this.radioGroup;
        group.addChild(this.rdb2);
        this.rdb3 = new eui.RadioButton();
        this.rdb3.label = this.Question[3];
        this.rdb3.value = 3;
        this.rdb3.group = this.radioGroup;
        group.addChild(this.rdb3);
        this.rdb4 = new eui.RadioButton();
        this.rdb4.label = this.Question[4];
        this.rdb4.value = 4;
        this.rdb4.group = this.radioGroup;
        group.addChild(this.rdb4);
        
        
    }
    
    private changeinitRadioButtonWithGroup(group: eui.Group,question: Array<string>): void {

        this.radioGroup.addEventListener(eui.UIEvent.CHANGE,this.radioChangeHandler,this);
        group.removeChild(this.rdb1);
        group.removeChild(this.rdb2);
        group.removeChild(this.rdb3);
        group.removeChild(this.rdb4);
        this.Question = this.Questions[this.QuestionCount]
        this.rdb1 = new eui.RadioButton();
        this.rdb1.label = this.Question[1];
        this.rdb1.value = 1;
        this.rdb1.group = this.radioGroup;
        
        this.rdb2 = new eui.RadioButton();
        this.rdb2.label = this.Question[2];
        this.rdb2.value = 2;
        this.rdb2.group = this.radioGroup;
        
        this.rdb3 = new eui.RadioButton();
        this.rdb3.label = this.Question[3];
        this.rdb3.value = 3;
        this.rdb3.group = this.radioGroup;
        
        this.rdb4 = new eui.RadioButton();
        this.rdb4.label = this.Question[4];
        this.rdb4.value = 4;
        this.rdb4.group = this.radioGroup;
        group.addChild(this.rdb1);
        group.addChild(this.rdb2);
        group.addChild(this.rdb3);
        group.addChild(this.rdb4);
    }
    private radioChangeHandler(evt:eui.UIEvent):void{
        this.button.enabled = true;
    }
    
    private initButton(group:eui.Group): void{
        this.button = new eui.Button();
        this.button.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnTouchHandle,this);
        this.button.touchEnabled = true;
        this.button.label = "确定";
        this.button.enabled = false;
        group.addChild(this.button);
    }
    private changeButton(group: eui.Group): void {
        group.removeChild(this.button);
        var button = new eui.Button();
        button.addEventListener(egret.TouchEvent.TOUCH_TAP,this.btnTouchHandle,this);
        button.label = "确定";
        group.addChild(this.button);
    }
    private result(group: eui.Group):void{
        group.removeChild(this.button);
        group.removeChild(this.lb);
        group.removeChild(this.rdb1);
        group.removeChild(this.rdb2);
        group.removeChild(this.rdb3);
        group.removeChild(this.rdb4);
        this.lbresult = new eui.Label();
        console.log("this.Score = " + this.Score);
        var i = Math.floor(this.Score / 10) -1;
        console.log("i = " + i);
        this.lbresult.text = this.results[i];
        console.log("this.results[i]" + this.results[i]);
        this.lbresult.width = 400;
        this.lbresult.height = 300;
        this.lbresult.bold = true;
        this.lbresult.verticalAlign = "middle";
        group.addChild(this.lbresult);
        
    }
    private btnTouchHandle(event:egret.TouchEvent):void{
        
        console.log("button touched,this.QuestionCount=" + this.QuestionCount);
        this.QuestionCount++;
        console.log("button touched,this.QuestionCount=" + this.QuestionCount);
        if(this.QuestionCount < this.Questions.length) {

            this.Question = this.Questions[this.QuestionCount];
            console.log("this.QuestionCount = " + this.QuestionCount);
            var score: Array<number> = this.Scores[this.QuestionCount - 1];

            console.log("this.radioGroup.selection.value = " + this.radioGroup.selection.value);
            this.Score = this.Score + score[this.radioGroup.selection.value];

            console.log("this.Score = " + this.Score);
            this.changeLable(this.myGroupmain,this.Question);
            this.changeinitRadioButtonWithGroup(this.myGroupmain,this.Question);
            this.changeButton(this.myGroupmain);
        }
        else if(this.QuestionCount == this.Questions.length){
            var score: Array<number> = this.Scores[this.QuestionCount-1];
            this.Score = this.Score + score[this.radioGroup.selection.value];
            this.result(this.myGroupmain);
        }
    }
    
    private initpic(group:eui.Group):void{
        var laughpic: egret.Bitmap = new egret.Bitmap(RES.getRes("laugh_raise_png"));
        group.addChild(laughpic);
    }
    
    private addQuestion(Q,A1,A2,A3,A4):Array<string>{
        var ques: Array < string > = new Array<string>();
        ques[4]=A4;
        ques[3]=A3;
        ques[2]=A2;
        ques[1]=A1;
        ques[0]=Q;
        return ques;
    }
    
    private addScore(A1,A2,A3,A4): Array<number> {
        var ques: Array<number> = new Array<number>();
        ques[4] = A4;
        ques[3] = A3;
        ques[2] = A2;
        ques[1] = A1;
        ques[0] = 0;
        return ques;
    }
    private initQuestions():Array<Array<string>>{
        var questions: Array<Array<string>> = new Array<Array<string>>();
        questions.push(this.addQuestion("最近一次拍老板马屁是什么时候？","就在刚刚！","这周拍过了","大概已经半个月了。。。","我这么正直的人，怎么会做这种事！"));
        questions.push(this.addQuestion("最近一次遇到工作阻力是如何处理的？","加班加点，拼命干活，努力解决掉","太极生两仪，两仪生四象，打个太极把事情推开~","报告老板，钱少活多压力大，干不下去了。。。","我这么有才华的人，怎么会有阻力！"));
        questions.push(this.addQuestion("比起身边的人你的薪资水平是？","差不多","比同等资历的人高","比同等资历的人低","一心扑在工作上的人，没空打听这种事！"));
        questions.push(this.addQuestion("最近一次加班是什么时候？","long long time ago...","今天","这周","每天工作辣么久，哪有时间加班！"));
        questions.push(this.addQuestion("有没有被家人抱怨工作占用时间太久？","当然没有，家人最重要","偶尔","经常","已离婚（分手）"));
        questions.push(this.addQuestion("加班发朋友圈吗？","当然！","当然！就算没有加班，伪装了也要发！","偶尔会","这么庸俗，从来不做！"));
        questions.push(this.addQuestion("上一次老板对你微笑是什么时候？","每天！","老板会笑？","上次给他干私活的时候。。。","嘲笑算吗？"));
        return questions;
    }
    private initScores(): Array<Array<number>> {
        var scores: Array<Array<number>> = new Array<Array<number>>();
        scores.push(this.addScore(10,5,3,0));
        scores.push(this.addScore(4,10,3,0));
        scores.push(this.addScore(6,3,10,0));
        scores.push(this.addScore(0,7,3,10));
        scores.push(this.addScore(0,5,8,15));
        scores.push(this.addScore(8,10,2,0));
        scores.push(this.addScore(10,3,5,0));
        return scores;
    }
    private initResults(): Array<string>{
        var results: Array<string> = new Array<string>("你这种人才，还想什么年终奖,看你天赋异禀，明年被开后跟我学做菜吧！","什么？年终奖，这盒没发完的月饼拿去吧","一个月工资快快磕头拿去","三个月工资拿去不谢","五个月的工资，外加十块钱的奖章","七个月的工资，嫌少还可以商量哦","即将走上人生巅峰的你，还在乎年终奖吗");
        return results;
    }
    

}
