"""Build three independent editable draw.io journeys and vector previews.

The user-confirmed system responsibilities supersede the older joint-flow diagram:
researchers use the Research Super Hub for reading/computing; creators build in
the AI Platform. No HTML or external renderer dependency is required.
"""
from pathlib import Path
from xml.etree import ElementTree as ET
from html import escape
from zipfile import ZipFile, ZIP_DEFLATED
import json
import unicodedata

OUT = Path(__file__).resolve().parents[1] / "角色使用旅程"
OUT.mkdir(exist_ok=True)
INK, BODY, BLUE = "#0B2146", "#526782", "#085FD7"
W = 1520


class Journey:
    def __init__(self, name, subtitle, height, start):
        self.name, self.subtitle, self.height, self.start = name, subtitle, height, start
        self.nodes, self.edges, self.bands, self.notes = {}, [], [], []

    def band(self, y, h, title, color="#F1F6FF"):
        self.bands.append((y, h, title, color))

    def node(self, key, x, y, text, w=360, h=104, kind="rect", pending=False):
        self.nodes[key] = dict(id=key, x=x, y=y, w=w, h=h, text=text,
                               kind=kind, pending=pending)

    def port(self, key, side):
        n = self.nodes[key]
        x, y, w, h = (n[k] for k in ("x", "y", "w", "h"))
        return dict(T=(x+w/2, y), B=(x+w/2, y+h),
                    L=(x, y+h/2), R=(x+w, y+h/2))[side]

    def link(self, source, target, start="B", end="T", via=(),
             label="", label_pos=None, secondary=False):
        first, last = self.port(source, start), self.port(target, end)
        if not via and first[0] != last[0] and first[1] != last[1]:
            if start in ("L", "R"):
                middle = (first[0]+last[0])/2
                via = ((middle, first[1]), (middle, last[1]))
            else:
                middle = (first[1]+last[1])/2
                via = ((first[0], middle), (last[0], middle))
        self.edges.append(dict(source=source, target=target,
            points=[first, *via, last],
            label=label, pos=label_pos, secondary=secondary))

    def note(self, x, y, w, h, text, size=17, bold=False):
        self.notes.append((x, y, w, h, text, size, bold))


# 01 RESEARCHER — researcher operates through the Research Super Hub.
r = Journey("01_科研人员使用旅程", "核心入口：科研超级中枢｜提交问题与材料 → 确认计划 → 中枢组织读、算 → 人工复核与迭代", 2820, "entry")
r.band(180, 310, "AI4S  /  定位研究")
r.band(515, 1390, "科研超级中枢  /  开展读、算", "#EEF7F4")
r.band(1930, 645, "AI4S  /  判断与成果")
r.node("entry",530,235,"01  进入工作台或课题空间\n明确本次研究目标\n[科研工作台 / 课题空间]")
r.node("hub",530,550,"02  进入科研超级中枢\n新建或继续研究会话\n[科研超级中枢 / 任务内中枢会话]")
r.node("input",530,705,"03  描述问题、加载上下文\n提供文献、数据、约束与版本\n[中枢输入区 · 上下文]")
r.node("plan",530,860,"04  查看中枢研究计划\n核对任务范围、能力与确认点\n[科研超级中枢 · 研究计划]")
r.node("ready",570,1020,"计划、材料与权限\n是否满足执行要求？",w=280,h=142,kind="diamond")
r.node("repair",1100,1034,"补充材料 / 调整计划\n申请所需资源授权\n[中枢上下文 / 资源授权]",w=315,h=114,pending=True)
r.node("dispatch",530,1215,"05  确认计划并推进研究\n中枢按任务组织读、算能力\n[科研超级中枢 · 执行会话]")
r.node("read",225,1380,"通过中枢开展「读」\n检索研读、证据摘录与引用\n[科研超级中枢 · 知识能力]",w=390)
r.node("compute",875,1380,"通过中枢开展「算」\n数据分析、模型调用与科学计算\n[科研超级中枢 · 工具能力]",w=390)
r.node("observe",530,1550,"06  在中枢查看进度与产物\n检查轨迹、工具状态和阶段结果\n[科研超级中枢 · 轨迹 / 产出]")
r.node("runGate",570,1710,"本次执行\n是否正常完成？",w=280,h=140,kind="diamond")
r.node("runError",1100,1720,"查看失败原因与调用记录\n补齐条件后回中枢调整重试\n[中枢轨迹 · 人工接管]",w=315,h=115,pending=True)
r.node("review",530,1995,"07  人工复核结果与证据\n核查来源、模型边界和适用条件\n[产物溯源 · 科学问题]")
r.node("evidence",570,2155,"本轮判断依据\n是否充分？",w=280,h=140,kind="diamond")
r.node("nextStudy",1100,2170,"补充证据 / 修订假设\n把下一轮问题带回中枢\n[科学问题 → 科研超级中枢]",w=315,h=115)
r.node("save",530,2380,"08  保存有边界的阶段判断\n保留证据、产物和未解决问题\n[科研任务 · 科学问题 · 空间资产]")
r.node("reuse",1050,2400,"按需整理可复用资产\n向项目管理人员提交阶段材料\n[空间资产 / 评审交接]",w=360,h=110,pending=True)
r.link("entry","hub")
r.link("hub","input")
r.link("input","plan")
r.link("plan","ready")
r.link("ready","repair","R","L",label="否",label_pos=(980,1070),secondary=True)
r.link("repair","input","T","R",via=[(1257.5,757)],secondary=True)
r.link("ready","dispatch",label="是",label_pos=(748,1190))
r.link("dispatch","read",via=[(710,1345),(420,1345)],label="按需选读",label_pos=(465,1320))
r.link("dispatch","compute",via=[(710,1345),(1070,1345)],label="按需选算",label_pos=(1030,1320))
r.link("read","observe",via=[(420,1512),(710,1512)])
r.link("compute","observe",via=[(1070,1512),(710,1512)])
r.link("observe","runGate")
r.link("runGate","runError","R","L",label="否",label_pos=(990,1760),secondary=True)
r.link("runError","plan","R","R",via=[(1470,1777.5),(1470,912)],secondary=True)
r.link("runGate","review",label="是",label_pos=(750,1875))
r.link("review","evidence")
r.link("evidence","nextStudy","R","L",label="否",label_pos=(985,2210),secondary=True)
r.link("nextStudy","input","R","R",via=[(1490,2227.5),(1490,757)],secondary=True)
r.link("evidence","save",label="是",label_pos=(750,2320))
r.link("save","reuse","R","L",label="按需",label_pos=(970,2415),secondary=True)
r.note(95,355,380,90,"起点：已有研究目标或待解决问题。\n课题空间提供研究归属；\n读、算操作围绕科研超级中枢展开。")
r.note(1100,550,315,145,"中枢可以调用底层知识、模型与工具。\n科研人员通过中枢推进任务，\n本旅程不要求其进入 AI 中台开发工具。\n底层服务接入状态以实际环境为准。",16)
r.note(130,1190,315,130,"读、算按计划选择和组合，\n可以只读、只算或读算迭代。\n图中两支不要求同时执行，\n在产出节点汇集本次实际结果。",16)
r.note(95,2165,355,125,"“依据充分”并不等于假设成立。\n反驳假设或保留分歧，也可以形成\n有来源、有边界的阶段判断。",17)
r.note(40,2610,1440,65,"图例：实框＝原型现有或本地演示；虚框＝尚待接入或未核实的业务环节。\n实箭头＝正常推进；虚箭头＝退回、跨角色交接或可选路径。",17,True)
r.note(40,2695,1440,80,"交付：阶段判断、证据与产物、下一轮研究问题或待评审材料。\n当前读、算运行仍为演示；权限申请、异常重试与成果送审的具体联动需在目标环境核实。",17)

# 02 CREATOR — concrete creation is in the AI Platform, not the AI4S catalog.
b = Journey("02_科研工具创建人员使用旅程", "建设主场：AI 中台｜接收需求 → 复用或新建 → 开发调试与验证 → 发布能力 → AI4S 登记与科研调用", 2730, "demand")
b.band(180,340,"需求侧  /  用途与验收")
b.band(545,1275,"AI 中台  /  工具建设与发布","#EEF7F4")
b.band(1845,640,"AI4S  /  登记、发现与调用")
b.node("demand",530,235,"01  明确工具用途与交付标准\n接收科研任务需求或使用反馈\n[科研人员交接 / 能力需求]")
b.node("reuseGate",570,380,"已有能力\n是否可以复用或扩展？",w=280,h=140,kind="diamond",pending=True)
b.node("reuseBuild",220,620,"02A  复用或扩展已有能力\n核对模型、程序、接口及许可\n[AI 中台 · 业务级步骤]",w=390,pending=True)
b.node("newBuild",880,620,"02B  创建新的工具能力\n明确开发方式和执行依赖\n[AI 中台 · 业务级步骤]",w=390,pending=True)
b.node("configure",530,805,"03  定义工具与调用契约\n输入输出、参数、依赖与边界\n[AI 中台 · 工具配置]",pending=True)
b.node("develop",530,970,"04  开发与调试工具\n接入所需程序、模型或服务\n[AI 中台 · 开发调试]",pending=True)
b.node("test",530,1135,"05  执行功能与科研适用性验证\n检查正常、异常、越界输入\n[AI 中台 · 测试验证]",pending=True)
b.node("testGate",570,1295,"约定测试与\n交付条件是否满足？",w=280,h=140,kind="diamond",pending=True)
b.node("fix",1100,1310,"定位失败原因\n修订实现、配置或适用边界\n[AI 中台 · 修改后重测]",w=315,h=114,pending=True)
b.node("release",530,1495,"06  发布可调用的能力版本\n交付调用标识、依赖与使用说明\n[AI 中台 · 能力发布]",pending=True)
b.node("handover",530,1670,"07  准备能力交接资料\n版本、输入输出、测试依据与授权\n[AI 中台 → AI4S]",pending=True)
b.node("register",530,1915,"08  在 AI4S 登记或关联资源\n引用中台能力，补充科研分类与说明\n[科研资源 / 空间资产]",pending=True)
b.node("available",530,2080,"09  核对版本、授权与可用范围\n按需发布资源并进入发现目录\n[AI4S · 科研资源]",pending=True)
b.node("use",530,2245,"10  交给科研超级中枢使用\n科研人员在研究任务中调用与复核\n[科研超级中枢 · 任务会话]",pending=True)
b.node("feedback",1100,2240,"接收失败样例与适用性反馈\n回 AI 中台修订并再次验证\n[使用反馈 → AI 中台]",w=315,h=118,pending=True)
b.node("delivered",530,2380,"交付可复用能力\n进入持续维护阶段",h=78,pending=True)
b.link("demand","reuseGate")
b.link("reuseGate","reuseBuild","L","T",via=[(415,450),(415,585)],label="是",label_pos=(455,425))
b.link("reuseGate","newBuild","R","T",via=[(1075,450),(1075,585)],label="否",label_pos=(995,425))
b.link("reuseBuild","configure",via=[(415,765),(710,765)])
b.link("newBuild","configure",via=[(1075,765),(710,765)])
b.link("configure","develop")
b.link("develop","test")
b.link("test","testGate")
b.link("testGate","fix","R","L",label="否",label_pos=(975,1345),secondary=True)
b.link("fix","develop","T","R",via=[(1257.5,1022)],secondary=True)
b.link("testGate","release",label="是",label_pos=(751,1470))
b.link("release","handover")
b.link("handover","register",label="跨系统交接",label_pos=(810,1850),secondary=True)
b.link("register","available")
b.link("available","use")
b.link("use","feedback","R","L",label="问题 / 需求",label_pos=(993,2265),secondary=True)
b.link("use","delivered")
b.link("feedback","configure","R","R",via=[(1465,2299),(1465,857)],secondary=True)
b.note(80,1070,340,155,"具体工具创建在 AI 中台完成。\nAI4S 中的资产登记表单\n不替代开发、调试和运行验证。\n此图不假定某一种模型、SDK\n或特定 AI 中台菜单。",18,True)
b.note(1100,1610,325,160,"能力发布 ≠ 资源上架。\n发布说明哪个版本可以被调用；\n上架说明哪些用户可以发现它。\n实际调用仍需满足权限与依赖条件。",17)
b.note(90,1940,335,135,"登记、关联或同步的具体方式\n需与实际 AI 中台方案对齐。\n本图不假定已经自动打通\nAPI、单点登录或目录同步。",17)
b.note(40,2520,1440,75,"图例：实框＝现有或已确认的角色动作；虚框＝业务级环节，具体页面或联动尚待核实。\n实箭头＝正常推进；虚箭头＝修改重试、跨系统交接或使用反馈。",17,True)
b.note(40,2620,1440,75,"交付：可识别的能力版本、调用与复用说明、测试依据、适用边界和维护责任。\n用户已明确“工具在 AI 中台创建”；当前工作区未提供 AI 中台页面，因此不将图中中台步骤视作已验证功能。",17)

# 03 PROJECT MANAGER — project goals, progress, evidence-based review, acceptance.
m = Journey("03_科研项目管理人员使用旅程", "管理主线：定位项目 → 明确阶段要求 → 跟踪风险 → 核查材料与组织评审 → 跟进整改或确认交付", 2670, "manageEntry")
m.band(180,790,"AI4S 科研管理  /  目标与过程","#F8F6F1")
m.band(995,340,"AI4S 课题空间  /  核查依据")
m.band(1358,1065,"AI4S 科研管理  /  评审与归档","#F8F6F1")
m.node("manageEntry",530,235,"01  进入科研管理\n定位目标项目与待办事项\n[门户 → 科研管理]")
m.node("objectives",530,390,"02  核对目标与阶段交付要求\n明确里程碑、职责与验收依据\n[立项管理 / 项目资料]",pending=True)
m.node("track",530,550,"03  查看进度与关键节点\n识别材料缺口、风险与变更\n[科研管理 · 过程管理]",pending=True)
m.node("riskGate",570,715,"存在需要处理的\n风险或变更？",w=280,h=140,kind="diamond",pending=True)
m.node("riskAction",1100,728,"明确影响、责任与处理措施\n按权限确认计划或资源调整\n[过程管理 · 管理决策]",w=315,h=114,pending=True)
m.node("evidence",530,1060,"04  进入课题核查阶段依据\n查看任务、报告、证据与验证计划\n[空间概览 · 科学问题 · 科研任务]")
m.node("scopeReview",530,1210,"05  明确本次评审对象与版本\n核对研究材料和工具交付资料\n[任务产出 / 空间资产 / 评审记录]")
m.node("reviewMeeting",530,1430,"06  组织负责人和专家评审\n专家评科学证据，管理者评阶段交付\n[科研管理 / 任务评审]",pending=True)
m.node("acceptGate",570,1600,"是否满足本阶段\n约定的交付要求？",w=280,h=140,kind="diamond",pending=True)
m.node("returnTask",1100,1615,"形成补充或整改意见\n指定责任人、所需材料与复核条件\n[评审反馈 → 科研 / 工具任务]",w=315,h=115,pending=True)
m.node("accept",530,1800,"07  确认阶段交付并留痕\n保留评审依据和遗留事项\n[成果管理 · 阶段确认]",pending=True)
m.node("continueGate",570,1960,"项目是否还有\n后续研究阶段？",w=280,h=140,kind="diamond",pending=True)
m.node("nextMilestone",1100,1975,"确定下一阶段目标与节点\n将责任和资源安排交回课题\n[过程管理 · 下一阶段]",w=315,h=115,pending=True)
m.node("archive",530,2170,"08  完成最终验收与归档\n对照项目条件核查材料、版本与确认\n[科研管理 · 成果管理]",pending=True)
m.link("manageEntry","objectives")
m.link("objectives","track")
m.link("track","riskGate")
m.link("riskGate","riskAction","R","L",label="是",label_pos=(985,765),secondary=True)
m.link("riskGate","evidence",label="否",label_pos=(750,908))
m.link("riskAction","evidence",via=[(1257.5,930),(710,930)],label="处置后继续核查",label_pos=(1110,906))
m.link("evidence","scopeReview")
m.link("scopeReview","reviewMeeting",label="材料与评审对象",label_pos=(815,1360),secondary=True)
m.link("reviewMeeting","acceptGate")
m.link("acceptGate","returnTask","R","L",label="否",label_pos=(985,1650),secondary=True)
m.link("returnTask","track","R","R",via=[(1460,1672.5),(1460,602)],secondary=True)
m.link("acceptGate","accept",label="是",label_pos=(750,1778))
m.link("accept","continueGate")
m.link("continueGate","nextMilestone","R","L",label="是",label_pos=(980,2010),secondary=True)
m.link("nextMilestone","objectives","R","R",via=[(1435,2032.5),(1435,442)],secondary=True)
m.link("continueGate","archive",label="否",label_pos=(750,2135))
m.note(90,450,340,155,"管理人员围绕项目和阶段决策。\n科研超级中枢的读、算结果\n是核查材料的一部分，\n不能用任务完成数替代\n科研进展与交付依据。",18)
m.note(90,1080,340,150,"科研人员提交：报告、证据、验证计划。\n工具创建人员提交：能力版本、\n测试依据、适用边界与维护说明。\n当前管理页到课题可能需手动转场。",17)
m.note(1100,1390,325,120,"管理反馈必须对应具体问题：\n谁来处理、补什么材料，\n以及下一次如何判定完成。",17)
m.note(90,1660,340,150,"专家判断科学证据是否充分；\n管理人员按授权确认项目交付。\n阶段验收通过不意味着\n所有科研假设都获得支持。",18,True)
m.note(1100,2200,330,115,"配套管理：外协、人才、考核与日程。\n按项目需要参与本旅程，\n不要求每次都依次办理。",17)
m.note(40,2460,1440,75,"图例：实框＝原型已有可查看页面；虚框＝管理业务要求，正式台账或流转尚待接入。\n实箭头＝正常推进；虚箭头＝跨角色交接、整改与下一阶段循环。",17,True)
m.note(40,2560,1440,80,"交付：有依据的阶段决定、责任分工、复核条件、后续节点及最终归档材料。\n当前管理模块和管理智能体多为入口提示；本图不代表真实审批、会签、通知、验收或权限控制已经完成。",17)


def svg_text(x,y,text,size=19,color=INK,align="middle",bold=False):
    lines=text.split("\n")
    start=y-(len(lines)-1)*size*.68
    return (f'<text x="{x}" y="{start}" text-anchor="{align}" dominant-baseline="middle" '
            f'font-family="PingFang SC,Microsoft YaHei,sans-serif" font-size="{size}" '
            f'font-weight="{650 if bold else 400}" fill="{color}">'+
            "".join(f'<tspan x="{x}" dy="{0 if i==0 else size*1.36}">{escape(line)}</tspan>'
                    for i,line in enumerate(lines))+"</text>")


def generate(j):
    mx=ET.Element("mxfile",host="app.diagrams.net",version="24.7.17",type="device",
                  compressed="false",modified="2026-10-10T00:00:00.000Z")
    d=ET.SubElement(mx,"diagram",id=j.start+"Journey",name=j.name)
    g=ET.SubElement(d,"mxGraphModel",dx=str(W),dy=str(j.height),grid="1",gridSize="10",
                    guides="1",connect="1",arrows="1",page="0",pageScale="1",
                    pageWidth=str(W),pageHeight=str(j.height),background="#FFFFFF",
                    math="0",shadow="0")
    root=ET.SubElement(g,"root")
    ET.SubElement(root,"mxCell",id="0")
    ET.SubElement(root,"mxCell",id="1",parent="0")
    svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{j.height}" viewBox="0 0 {W} {j.height}">',
         '<defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#526782"/></marker></defs>',
         '<rect width="100%" height="100%" fill="white"/>']

    def cell(key,value,x,y,w,h,style):
        c=ET.SubElement(root,"mxCell",id=key,value=value,vertex="1",parent="1",style=style)
        ET.SubElement(c,"mxGeometry",x=str(x),y=str(y),width=str(w),height=str(h),attrib={"as":"geometry"})

    def label(key,x,y,w,h,value,size=17,bold=False,bg=False,center=False):
        cell(key,value,x,y,w,h,
             f"text;html=0;whiteSpace=wrap;align={'center' if center else 'left'};verticalAlign=middle;"
             f"fontFamily=Helvetica;fontSize={size};fontColor={INK if bold else BODY};"
             f"fontStyle={1 if bold else 0};fillColor={'#FFFFFF' if bg else 'none'};strokeColor=none;spacing=0;")
        if bg:
            svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="white" rx="3"/>')
        svg.append(svg_text(x+w/2 if center else x,y+h/2,value,size,INK if bold else BODY,
                            "middle" if center else "start",bold))

    for i,(y,h,title,color) in enumerate(j.bands):
        cell("band"+str(i),"",35,y,1450,h,f"rounded=0;fillColor={color};strokeColor=#DAE4EE;connectable=0;")
        svg.append(f'<rect x="35" y="{y}" width="1450" height="{h}" fill="{color}" stroke="#DAE4EE"/>')
        label("bandTitle"+str(i),65,y+8,1360,40,title,20,True)
    for i,e in enumerate(j.edges):
        a,b=j.nodes[e["source"]],j.nodes[e["target"]]
        points=e["points"]
        ex=(points[0][0]-a["x"])/a["w"]; ey=(points[0][1]-a["y"])/a["h"]
        ix=(points[-1][0]-b["x"])/b["w"]; iy=(points[-1][1]-b["y"])/b["h"]
        style=(f"edgeStyle=orthogonalEdgeStyle;rounded=0;html=0;strokeColor={BODY};strokeWidth=2;"
               f"endArrow=block;endFill=1;exitX={ex};exitY={ey};entryX={ix};entryY={iy};"
               "exitDx=0;exitDy=0;entryDx=0;entryDy=0;"+
               ("dashed=1;dashPattern=7 5;" if e["secondary"] else ""))
        edgecell=ET.SubElement(root,"mxCell",id="edge"+str(i),edge="1",parent="1",
                      source=e["source"],target=e["target"],style=style)
        geo=ET.SubElement(edgecell,"mxGeometry",relative="1",attrib={"as":"geometry"})
        if len(points)>2:
            arr=ET.SubElement(geo,"Array",attrib={"as":"points"})
            for x,y in points[1:-1]:
                ET.SubElement(arr,"mxPoint",x=str(x),y=str(y))
        dash='stroke-dasharray="7 5"' if e["secondary"] else ""
        svg.append('<polyline points="'+" ".join(f"{x},{y}" for x,y in points)+
                   f'" fill="none" stroke="{BODY}" stroke-width="2" {dash} marker-end="url(#arrow)"/>')
    for n in j.nodes.values():
        x,y,w,h,text=(n[k] for k in ("x","y","w","h","text"))
        decision=n["kind"]=="diamond"
        fill="#FFF8E8" if decision else "#FFFFFF"
        stroke=BODY if n["pending"] else BLUE
        style=(("rhombus;" if decision else "rounded=1;arcSize=10;")+
              f"whiteSpace=wrap;html=0;align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=19;")
        style+=f"fontColor={INK};fillColor={fill};strokeColor={stroke};strokeWidth=2;spacing=8;"
        if n["pending"]:
            style+="dashed=1;dashPattern=7 5;"
        cell(n["id"],text,x,y,w,h,style)
        dash='stroke-dasharray="7 5"' if n["pending"] else ""
        if decision:
            svg.append(f'<polygon points="{x+w/2},{y} {x+w},{y+h/2} {x+w/2},{y+h} {x},{y+h/2}" fill="{fill}" stroke="{stroke}" stroke-width="2" {dash}/>')
        else:
            svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{stroke}" stroke-width="2" {dash}/>')
        svg.append(svg_text(x+w/2,y+h/2,text))
    for i,e in enumerate(j.edges):
        if e["label"]:
            x,y=e["pos"]; w=max(46,len(e["label"])*16+20)
            label("edgeText"+str(i),x-w/2,y-15,w,30,e["label"],16,bg=True,center=True)
    title=j.name[3:]
    label("title",40,25,1440,53,"ScienceLab AI4S  /  "+title,30,True)
    label("subtitle",40,91,1440,52,j.subtitle,19)
    for i,(x,y,w,h,t,size,bold) in enumerate(j.notes):
        label("note"+str(i),x,y,w,h,t,size,bold)
    label("date",40,j.height-30,1440,22,"角色与系统分工依据用户确认；对应原型模块参考本工作区。更新：2026-10-10",14)
    ET.indent(mx)
    path=OUT/(j.name+".drawio")
    ET.ElementTree(mx).write(path,encoding="utf-8",xml_declaration=True)
    svg.append("</svg>")
    (OUT/(j.name+"预览.svg")).write_text("\n".join(svg),encoding="utf-8")
    validate(j,path)
    return path


def validate(j,path):
    parsed=ET.parse(path)
    cells=parsed.findall(".//mxCell")
    ids=[c.get("id") for c in cells]
    assert len(ids)==len(set(ids)), "duplicate ID"
    for c in cells:
        for attr in ("parent","source","target"):
            assert c.get(attr) is None or c.get(attr) in ids, (c.get("id"),attr)
    for edge in j.edges:
        for first,last in zip(edge["points"],edge["points"][1:]):
            assert first[0]==last[0] or first[1]==last[1], "non-orthogonal segment"
    for n in j.nodes.values():
        assert 0<=n["x"] and n["x"]+n["w"]<=W
        assert 0<=n["y"] and n["y"]+n["h"]<=j.height
        if n["kind"]=="diamond":
            branches=[e for e in j.edges if e["source"]==n["id"]]
            assert len(branches)==2 and {e["label"] for e in branches}=={"是","否"},n["id"]
        # Conservative text-width check: 19px, approx one em per CJK character.
        for line in n["text"].split("\n"):
            em=sum(1 if unicodedata.east_asian_width(ch) in ("W","F") else .56 for ch in line)
            assert em*19 <= n["w"]-20, (n["id"],line,"label too wide")
    reached={j.start}
    while True:
        more=reached|{e["target"] for e in j.edges if e["source"] in reached}
        if reached==more:
            break
        reached=more
    assert reached==set(j.nodes), "unreachable node"
    # Every non-terminal can ultimately reach at least one delivered outcome.
    outgoing={e["source"] for e in j.edges}
    terminal=set(j.nodes)-outgoing
    can_finish=set(terminal)
    while True:
        more=can_finish|{e["source"] for e in j.edges if e["target"] in can_finish}
        if more==can_finish:
            break
        can_finish=more
    assert can_finish==set(j.nodes), "no route to outcome"
    print(json.dumps({"file":path.name,"nodes":len(j.nodes),"edges":len(j.edges),
        "single_page":True,"xml":"valid","decision_branches":"complete","reachability":"pass"},
        ensure_ascii=False))


if __name__=="__main__":
    outputs=[generate(j) for j in (r,b,m)]
    instructions="""AI4S 三类角色独立使用旅程

导入：飞书文档插入或新建「画板」→ 打开画板 → 右上角「…」→ 导入 → 选择 .drawio 文件。
建议每个文件导入一张独立画板。SVG 文件只用于预览，导入编辑请选择 .drawio。

01 科研人员：科研超级中枢是开展读、算的主要入口。
02 科研工具创建人员：在 AI 中台进行具体工具创建、开发、调试和验证；AI4S 负责资源登记和科研调用。
03 科研项目管理人员：围绕项目目标、风险、阶段评审、整改和归档推进。

实框表示已有或已确认的角色动作；虚框表示待接入或尚未核实的业务环节。
实箭头为正常推进，虚箭头为退回、可选或交接路径。各图底部有具体原型边界说明。
AI 中台页面不在当前工作区；图中采用业务级步骤，不假定特定菜单或自动同步方式。

飞书官方导入说明：
https://www.feishu.cn/hc/zh-CN/articles/018852745122-从外部导入内容至画板

已检查 XML、节点引用、判断分支和预览布局。尚未在你的飞书账号中实际导入；飞书转换后可能有轻微排版差异。
这些独立图采用用户最新确认的系统分工；旧版三角色合图和 HTML 说明保留未覆盖。
"""
    (OUT/"导入说明.txt").write_text(instructions,encoding="utf-8")
    with ZipFile(OUT/"AI4S三类角色使用旅程.zip","w",ZIP_DEFLATED) as z:
        for p in [*outputs,*(OUT/(j.name+"预览.svg") for j in (r,b,m)),OUT/"导入说明.txt"]:
            z.write(p,p.name)
