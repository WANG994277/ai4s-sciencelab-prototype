"""Generate a single-page, editable draw.io swimlane and a matching SVG preview."""
from pathlib import Path
from xml.etree import ElementTree as ET
from html import escape
import json

OUT = Path(__file__).resolve().parents[1]
BASE = "AI4S三角色业务流程图"
W, H = 1560, 2770
INK, BLUE, LINE = "#0B2146", "#085FD7", "#526782"
nodes, edges, labels = [], [], []


def node(key, x, y, w, h, text, kind="rect", planned=False):
    nodes.append(dict(id=key, x=x, y=y, w=w, h=h, text=text,
                      kind=kind, planned=planned))


def edge(source, target, points, label="", pos=None, planned=False):
    edges.append(dict(source=source, target=target, points=points,
                      label=label, pos=pos, planned=planned))


# All shapes use independent, native mxCells for conservative import compatibility.
# Lanes are plain editable rectangles; no embedded images or custom HTML shapes.
node("researchEntry", 130, 310, 300, 100,
     "01  进入已有课题\n核对目标与研究上下文\n[科研工作台 → 课题空间]")
node("question", 130, 470, 300, 100,
     "02  明确科学问题与假设\n约定验证标准和适用边界\n[科学问题]")
node("task", 130, 630, 300, 100,
     "03  组织科研任务与材料\n确定数据版本和所需能力\n[科研任务 · 任务上下文]")
node("capabilityGate", 150, 800, 260, 150,
     "现有能力\n是否满足需求？", "diamond")
node("execution", 130, 1460, 300, 100,
     "04  确认计划并开展研究\n会话 / 计算 / 实验（演示）\n[科研任务 · 科研活动]")
node("provenance", 130, 1620, 300, 100,
     "05  检查产物与证据\n核对来源、条件与局限\n[产出视图 · 证据研判]")
node("evidenceGate", 150, 1790, 260, 150,
     "本轮判断依据\n是否充分？", "diamond")
node("researchResult", 130, 2000, 300, 100,
     "06  形成限定范围的判断\n提交阶段材料与验证计划\n[科学问题 · 科研任务]")
node("researchRework", 130, 2185, 300, 100,
     "07  落实评审意见\n补充材料 / 调整验证任务\n[科研任务 · 科学问题]")
node("researchAsset", 130, 2400, 300, 105,
     "08  整理可复用科研资产\n可选：保留来源与使用边界\n[空间资产]")

node("buildDemand", 630, 825, 300, 100,
     "承接科研能力需求\n检查复用 / 扩展 / 新建方案\n[空间资产 · 科研资产]")
node("buildConfig", 630, 985, 300, 110,
     "创建工具建设配置\n输入输出、依赖与测试要求\n[新建科研资产 → 科研工具]")
node("buildTest", 630, 1145, 300, 100,
     "保存草稿并建立验证计划\n核对配置、日志与预期输出\n[测试 / 验证 → 科研活动]")
node("testGate", 650, 1290, 260, 130,
     "测试与交付条件\n是否满足？", "diamond", True)
node("buildRelease", 630, 1460, 300, 100,
     "发布可识别的工具版本\n交付复用说明；上架按需\n[空间资产 · 科研资产]")
node("buildFeedback", 630, 1795, 300, 100,
     "接收异常与使用反馈\n修订配置 / 优化能力\n[资产编辑；版本迭代待完善]")

node("projectGoal", 1130, 310, 300, 100,
     "明确项目目标与阶段要求\n约定节点、职责及验收依据\n[科研管理 · 立项管理]", planned=True)
node("projectTrack", 1130, 630, 300, 100,
     "跟踪里程碑、风险与变更\n定位需要复核的课题事项\n[科研管理 · 过程管理]", planned=True)
node("projectEvidence", 1130, 1620, 300, 100,
     "进入课题核查阶段依据\n查看报告、证据与验证安排\n[空间概览 · 科学问题 · 任务]")
node("projectReview", 1130, 2000, 300, 100,
     "组织阶段评审\n专家评证据；管理者评交付\n[科研管理 / 任务评审]", planned=True)
node("deliveryGate", 1150, 2160, 260, 150,
     "满足阶段\n交付要求？", "diamond", True)
node("projectAccept", 1130, 2400, 300, 105,
     "确认阶段交付并归档\n明确下一节点与遗留事项\n[科研管理 · 成果管理]", planned=True)

# Three explicit handoffs, with labels in clear inter-lane corridors.
edge("projectGoal", "researchEntry", [(1130,360),(430,360)],
     "目标、节点与验收要求", (780,337), True)
edge("researchEntry","question",[(280,410),(280,470)])
edge("question","task",[(280,570),(280,630)])
edge("task","capabilityGate",[(280,730),(280,800)])
edge("capabilityGate","buildDemand",[(410,875),(630,875)],
     "否 · 能力需求", (520,854), True)
edge("capabilityGate","execution",[(150,875),(110,875),(110,1510),(130,1510)],
     "是", (115,917))
edge("buildDemand","buildConfig",[(780,925),(780,985)])
edge("buildConfig","buildTest",[(780,1095),(780,1145)])
edge("buildTest","testGate",[(780,1245),(780,1290)],planned=True)
edge("testGate","buildRelease",[(780,1420),(780,1460)],
     "是", (811,1443), True)
edge("testGate","buildConfig",[(910,1355),(975,1355),(975,1040),(930,1040)],
     "否 · 修改后重测", (1070,1180), True)
edge("buildRelease","execution",[(630,1510),(430,1510)],
     "版本与使用说明", (530,1487), True)
edge("execution","provenance",[(280,1560),(280,1620)])
edge("provenance","evidenceGate",[(280,1720),(280,1790)])
edge("provenance","buildFeedback",[(430,1670),(580,1670),(580,1845),(630,1845)],
     "异常 / 适用性反馈", (784,1690), True)
edge("buildFeedback","buildConfig",[(930,1845),(995,1845),(995,990),(930,990)],
     "迭代完善", (1070,1770), True)
edge("evidenceGate","question",[(150,1865),(85,1865),(85,520),(130,520)],
     "否", (117,1830))
edge("evidenceGate","researchResult",[(280,1940),(280,2000)],
     "是", (315,1973))
edge("researchResult","projectReview",[(430,2050),(1130,2050)],
     "阶段报告 / 证据包 / 验证计划", (780,2026), True)
edge("projectGoal","projectTrack",[(1280,410),(1280,630)],planned=True)
edge("projectTrack","projectEvidence",[(1280,730),(1280,1620)],
     "发现需关注事项，按授权查看", (1300,1130), True)
edge("projectEvidence","projectReview",[(1280,1720),(1280,2000)],
     "核查依据后组织评审", (1295,1890), True)
edge("projectReview","deliveryGate",[(1280,2100),(1280,2160)],planned=True)
edge("deliveryGate","researchRework",[(1150,2235),(430,2235)],
     "否 · 补充验证 / 调整计划", (780,2210), True)
edge("researchRework","task",[(130,2235),(55,2235),(55,680),(130,680)],planned=True)
edge("deliveryGate","projectAccept",[(1280,2310),(1280,2400)],
     "是", (1312,2355), True)
edge("projectAccept","researchAsset",[(1130,2452),(430,2452)],
     "有复用价值且满足共享条件时", (780,2428), True)

# Canvas notes explain source fidelity, partial conclusions, and the line convention.
labels = [
 ("title",40,25,1480,50,"ScienceLab AI4S 三角色业务流程图",32,INK,True),
 ("subtitle",40,85,1480,44,"以正式课题为主线：开展科研 → 按需建设能力 → 复核证据 → 组织评审 → 继续验证或归档",19,LINE,False),
 ("read",40,137,1480,30,"阅读方式：泳道内由上向下；跨泳道箭头表示交接。科研工具创建是按需分支，已有能力可直接复用。",16,LINE,False),
 ("reuseNote",150,1120,330,86,"已有能力满足需求时\n沿左侧路径进入研究执行\n无需经过工具新建与发布",18,LINE,False),
 ("evidenceReturn",150,1290,315,82,"判断依据不足时\n沿回路补充证据或修订假设\n返回第02步，组织下一轮验证",17,LINE,False),
 ("buildNote",630,410,300,130,"科研工具创建人员按需参与\n接收：需求、样例输入与验收条件\n交付：版本、测试依据与使用边界",18,LINE,False),
 ("resultNote",610,1930,340,60,"依据充分可形成有边界的结论；\n发现分歧也可形成阶段判断。",16,LINE,False),
 ("reworkNote",630,2285,310,65,"管理反馈返回科研任务；\n涉及能力问题时再走工具建设分支。",16,LINE,False),
 ("legend",40,2560,1480,40,"图例：矩形＝业务动作　菱形＝判断　实线＝原型可查看或本地演示　虚线＝手动交接、流程要求或待接入",17,INK,True),
 ("scope",40,2610,1480,70,"原型边界：管理域入口多为提示；测试、发布和上架不代表真实服务已运行或审核通过。\n三角色为职责视角；自动权限切换、跨模块同步、测试通过门禁和正式项目审批尚未完整接入。",17,LINE,False),
 ("footer",40,2700,1480,35,"科研执行完成 ≠ 科学结论成立 ≠ 资产发布 ≠ 阶段验收通过　｜　依据：工作区原型与三角色演示说明 · 2026-10-10",16,LINE,False),
]

mxfile=ET.Element("mxfile",host="app.diagrams.net",modified="2026-10-10T00:00:00.000Z",
                  agent="ScienceLab business workflow",version="24.7.17",type="device",compressed="false")
diagram=ET.SubElement(mxfile,"diagram",id="ai4s-role-flow",name="三角色业务流程")
model=ET.SubElement(diagram,"mxGraphModel",dx="1560",dy="2770",grid="1",gridSize="10",
                    guides="1",tooltips="1",connect="1",arrows="1",fold="1",
                    page="0",pageScale="1",pageWidth=str(W),pageHeight=str(H),
                    math="0",shadow="0",background="#FFFFFF")
root=ET.SubElement(model,"root")
ET.SubElement(root,"mxCell",id="0")
ET.SubElement(root,"mxCell",id="1",parent="0")


def cell(key,text,x,y,w,h,style):
    c=ET.SubElement(root,"mxCell",id=key,value=text,style=style,vertex="1",parent="1")
    ET.SubElement(c,"mxGeometry",x=str(x),y=str(y),width=str(w),height=str(h),attrib={"as":"geometry"})


lane_defs=[(40,"科研人员","#F1F6FF","#D8E7FA"),
           (540,"科研工具创建人员","#F3F8F6","#DAEBE4"),
           (1040,"科研项目管理人员","#F8F6F1","#EAE3D5")]
for i,(x,title,fill,stroke) in enumerate(lane_defs):
    cell("lane"+str(i),"",x,195,480,2340,
         f"rounded=0;fillColor={fill};strokeColor={stroke};connectable=0;")
    cell("laneHead"+str(i),title,x+15,208,450,57,
         f"text;html=0;align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=25;fontStyle=1;fontColor={INK};strokeColor=none;fillColor=none;")


def anchors(n,p):
    return ((p[0]-n["x"])/n["w"], (p[1]-n["y"])/n["h"])


byid={n["id"]:n for n in nodes}
for i,e in enumerate(edges):
    pts=e["points"]
    ex,ey=anchors(byid[e["source"]],pts[0])
    ix,iy=anchors(byid[e["target"]],pts[-1])
    style=(f"edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=0;"
           f"strokeColor={LINE};strokeWidth=2;endArrow=block;endFill=1;"
           f"exitX={ex};exitY={ey};exitDx=0;exitDy=0;entryX={ix};entryY={iy};entryDx=0;entryDy=0;")
    if e["planned"]:
        style+="dashed=1;dashPattern=7 5;"
    c=ET.SubElement(root,"mxCell",id="edge"+str(i),style=style,edge="1",
                    parent="1",source=e["source"],target=e["target"])
    g=ET.SubElement(c,"mxGeometry",relative="1",attrib={"as":"geometry"})
    if len(pts)>2:
        a=ET.SubElement(g,"Array",attrib={"as":"points"})
        for x,y in pts[1:-1]:
            ET.SubElement(a,"mxPoint",x=str(x),y=str(y))

for n in nodes:
    shape="rhombus;" if n["kind"]=="diamond" else "rounded=1;arcSize=10;"
    fill="#FFF9EA" if n["kind"]=="diamond" else "#FFFFFF"
    style=(shape+f"whiteSpace=wrap;html=0;align=center;verticalAlign=middle;"
           f"fontFamily=Helvetica;fontSize=19;fontColor={INK};fillColor={fill};"
           f"strokeColor={BLUE if not n['planned'] else LINE};strokeWidth=2;spacing=8;")
    if n["planned"]:
        style+="dashed=1;dashPattern=7 5;"
    cell(n["id"],n["text"],n["x"],n["y"],n["w"],n["h"],style)

for i,e in enumerate(edges):
    if e["label"]:
        x,y=e["pos"]
        width=max(70,len(e["label"])*17+22)
        cell("edgeLabel"+str(i),e["label"],x-width/2,y-16,width,30,
             f"text;html=0;align=center;verticalAlign=middle;fontFamily=Helvetica;fontSize=16;fontColor={LINE};fillColor=#FFFFFF;strokeColor=none;spacing=3;")
for key,x,y,w,h,text,size,color,bold in labels:
    cell(key,text,x,y,w,h,
         f"text;html=0;align=left;verticalAlign=middle;whiteSpace=wrap;fontFamily=Helvetica;fontSize={size};fontColor={color};fontStyle={1 if bold else 0};fillColor=none;strokeColor=none;spacing=0;")
ET.indent(mxfile)
drawio=OUT/(BASE+".drawio")
ET.ElementTree(mxfile).write(drawio,encoding="utf-8",xml_declaration=True)

# A local vector preview of the exact same model, not a replacement for the editable file.
svg=[f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
     '<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#526782"/></marker></defs>',
     '<rect width="100%" height="100%" fill="#FFFFFF"/>']
FONT="'PingFang SC','Microsoft YaHei',sans-serif"


def text_svg(x,y,text,size=19,color=INK,anchor="middle",bold=False):
    lines=text.split("\n")
    first=y-(len(lines)-1)*size*.68
    out=f'<text x="{x}" y="{first}" text-anchor="{anchor}" dominant-baseline="middle" font-family="{FONT}" font-size="{size}" font-weight="{650 if bold else 400}" fill="{color}">'
    out+="".join(f'<tspan x="{x}" dy="{0 if j==0 else size*1.36}">{escape(line)}</tspan>' for j,line in enumerate(lines))
    return out+"</text>"


for x,title,fill,stroke in lane_defs:
    svg.append(f'<rect x="{x}" y="195" width="480" height="2340" fill="{fill}" stroke="{stroke}"/>')
    svg.append(text_svg(x+240,237,title,25,bold=True))
for e in edges:
    dash=' stroke-dasharray="7 5"' if e["planned"] else ""
    points=" ".join(f"{x},{y}" for x,y in e["points"])
    svg.append(f'<polyline points="{points}" fill="none" stroke="{LINE}" stroke-width="2"{dash} marker-end="url(#arrow)"/>')
for n in nodes:
    x,y,w,h=n["x"],n["y"],n["w"],n["h"]
    color=LINE if n["planned"] else BLUE
    dash=' stroke-dasharray="7 5"' if n["planned"] else ""
    if n["kind"]=="diamond":
        points=f"{x+w/2},{y} {x+w},{y+h/2} {x+w/2},{y+h} {x},{y+h/2}"
        svg.append(f'<polygon points="{points}" fill="#FFF9EA" stroke="{color}" stroke-width="2"{dash}/>')
    else:
        svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="white" stroke="{color}" stroke-width="2"{dash}/>')
    svg.append(text_svg(x+w/2,y+h/2,n["text"],19))
for e in edges:
    if e["label"]:
        x,y=e["pos"]; width=max(70,len(e["label"])*17+22)
        svg.append(f'<rect x="{x-width/2}" y="{y-16}" width="{width}" height="30" rx="3" fill="white"/>')
        svg.append(text_svg(x,y,e["label"],16,LINE))
for key,x,y,w,h,text,size,color,bold in labels:
    svg.append(text_svg(x,y+h/2,text,size,color,"start",bold))
svg.append("</svg>")
(OUT/(BASE+"预览.svg")).write_text("\n".join(svg),encoding="utf-8")

# Format and topology checks: unique IDs, valid references, decision coverage, bounds.
parsed=ET.parse(drawio)
cells=parsed.findall(".//mxCell")
ids=[c.attrib["id"] for c in cells]
assert len(ids)==len(set(ids)), "Duplicate cell IDs"
for c in cells:
    for attr in ("source","target","parent"):
        if attr in c.attrib:
            assert c.attrib[attr] in ids, (c.attrib["id"],attr)
for n in nodes:
    assert 0 <= n["x"] and 0 <= n["y"] and n["x"]+n["w"] <= W and n["y"]+n["h"] <= H
    outgoing=[e for e in edges if e["source"]==n["id"]]
    if n["kind"]=="diamond":
        assert len(outgoing)==2, (n["id"],"missing decision branch")
reachable={"projectGoal"}
while True:
    updated=reachable|{e["target"] for e in edges if e["source"] in reachable}
    if updated==reachable:
        break
    reachable=updated
assert reachable==set(byid), "Unreachable workflow nodes"
print(json.dumps({"file":str(drawio),"nodes":len(nodes),"edges":len(edges),"lanes":3,
                  "pages":1,"xml":"valid","decision_branches":"complete","nodes_reachable":True,
                  "bytes":drawio.stat().st_size},ensure_ascii=False,indent=2))
