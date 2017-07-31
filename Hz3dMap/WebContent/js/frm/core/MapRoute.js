//路径的设置及展示
define(['frm/events/EventConsts', 'THREE', 'frm/component/DiyLine'], function(EventConsts, THREE, DiyLine) {

    String.prototype.format = function() {
        var str = this;
        for (var i = 0; i < arguments.length; i++) {
            str = str.replace('{' + i + '}', arguments[i]);
        }
        return str;
    };
    THREE.Line.prototype.getSP = function() {
        return new THREE.Vector3().copy(this.geometry.vertices[0]);
    };

    THREE.Line.prototype.getCP = function() {
        if (this.type == 'curve2')
            return new THREE.Vector3().copy(this.geometry.vertices[1]);
    };

    THREE.Line.prototype.getEP = function() {
        return new THREE.Vector3().copy(this.geometry.vertices[this.geometry.vertices.length - 1]);
    };


    //绘制面板类
    var MapRoute = {
        create: function(worldScene, worldCamera, worldeControls, worldRaycaster, worldPlane, worldW, worldH, TransformControls) {
            var instance = new THREE.EventDispatcher();
            var enable = false;
            var camera, scene, plane, controls, transformControls;
            var _raycaster;

            var stageW = 0; //舞台宽
            var stageH = 0; //舞台高
            var minY = 10; //设定最小高度
            camera = worldCamera;
            scene = worldScene;
            controls = worldeControls;
            transformControls = TransformControls;
            transformControls.minY = minY;
            _raycaster = worldRaycaster;
            plane = worldPlane;
            stageW = worldW;
            stageH = worldH;
            var enableMouseMove = false;
            var moveNode = null;
            var hzThree = EventConsts.hzThree;
            var Events = EventConsts.Events;
            var HzEvent = EventConsts.HzEvent;


            var LineTypes = {
                    SIDE: "side",
                    CURVE2: "curve2",
                    CURVE3: "curve3",
                    AUX: "aux"

                },
                PointTypes = {
                    CORNER: "corner",
                    CUT: "cut",
                    CONTROL: "control"
                },
                Status = {
                    DRAW: 'draw',
                    EDIT: 'edit',
                    CONVERT: 'convert',
                    SEE: 'see'
                },
                ObjTypes = {
                    LINE: 'line',
                    POINT: 'point'
                };
            var defaultColor = 0xFFFF00,
                selectedColor = 0xFF00FF,
                _state = Status.DRAW,
                count = 100;

            var _nodeList = [];

            var _objects = [],
                _polygons = [],
                _mouse = new THREE.Vector3(),
                _moved = false,
                _converted = false,
                _currLine, _selected, currObj, _tip, _startPoint, _endPoint, _nodes;
            //  projector = new THREE.Projector();

            var needDraw = false;


            var mouseOverGeometry = new THREE.SphereBufferGeometry(3, 32, 32);
            var mouseOverMesh = new THREE.Mesh(mouseOverGeometry, new THREE.MeshLambertMaterial({
                color: 0x00EEFF
            }));
            mouseOverMesh.visible = false;
            scene.add(mouseOverMesh);
            mouseOverMesh.name = 'mouseover_mesh';
            mouseOverMesh.enable = false;
            _objects.add(mouseOverMesh);

            // var animate = function() {
            //     requestAnimationFrame(animate);
            //     render();
            //     controls.update();
            // };
            // var render = function() {
            //     renderer.render(scene, camera);
            // };
            //获取样式
            var getStyle = function(node, property) {
                if (node.style[property]) {
                    return node.style[property];
                } else if (node.currentStyle) {
                    return node.currentStyle[property];
                } else if (document.defaultView && document.defaultView.getComputedStyle) {
                    var style = document.defaultView.getComputedStyle(node, null);
                    return style.getPropertyValue(property);
                }

                return null;
            };



            // var onWindowResize = function() {
            //     stageW = parseInt(getStyle(container, 'width'));
            //     stageH = parseInt(getStyle(container, 'height'));
            //     camera.aspect = parseInt(getStyle(container, 'width')) / parseInt(getStyle(container, 'height'));
            //     camera.updateProjectionMatrix();
            //     renderer.setSize(parseInt(getStyle(container, 'width')), parseInt(getStyle(container, 'height')));
            // };
            var onMouseDown = function(e) {


                if (_state == Status.SEE || e.shiftKey === true) {
                    return;
                }
                //    container.addEventListener("mousemove", onMouseMove);
                enableMouseMove = true;
                var btnNum = e.button;
                _moved = false;



                if (e.shiftKey === false) {
                    _selected = getSelectedTarget(e);
                }
                if (_selected) {

                    var obj = _selected.object;

                    controls.enabled = false;
                    if (obj.enabled) {
                        //  renderer.domElement.style.cursor = 'move';
                        if (obj.name == ObjTypes.LINE)
                            obj.prevPoint.copy(getMousePosition(e));
                    }
                    if (obj.type != "Mesh" && obj.type != PointTypes.CONTROL) {
                        setSelectedStyle(obj);

                    }
                    if (e.shiftKey && obj.name == ObjTypes.POINT) {
                        //  convertStart(obj);
                    } else if (obj.name == ObjTypes.LINE && obj.type != LineTypes.AUX) {

                        addCornerPoint(obj, _selected.point);
                        //addCutPointToLine(obj, _selected.point);
                    } else if (obj.name == 'mouseover_mesh' && obj.visible === true) {
                        addCornerPoint(obj.line, obj.position);
                    }
                    if (obj.name == ObjTypes.POINT) {
                        moveNode = _selected.object;

                    }
                } else {
                    enableMouseMove = false;
                }
            };
            var onMouseMove = function(e) {

                // if (enableMouseMove === false) {
                //     return;
                // }
                if (_state == Status.SEE) {
                    return;
                }

                _moved = _state == Status.DRAW;

                // var point = getMousePosition(e);

                var objline = getMouseLine(e);

                if (objline !== null && objline.object.name == 'line') {
                    var pos = objline.point;
                    mouseOverMesh.position.copy(pos);
                    mouseOverMesh.visible = true;
                    mouseOverMesh.line = objline.object;
                } else if (objline === null) {
                    mouseOverMesh.visible = false;
                    mouseOverMesh.line = null;
                }



            };

            var nodeChangeTimes = 0;
            var nodeChange = function(e) {
                if (moveNode !== null) {
                    nodeChangeTimes++;
                    if (moveNode.position.y < minY) {
                        moveNode.position.y = minY;
                    }
                    dragObject(moveNode.position.clone());
                }
            }

            var nodeChangeOver = function(e) {
                if (moveNode !== null) {
                    if (nodeChangeTimes > 1) {
                        instance.dispatchEvent(new Events(HzEvent.CHANGE_POINT_ROUTE, moveNode));
                    }
                    nodeChangeTimes = 0;
                }
            }

            var selectedObj = null;
            var onMouseUp = function(e) {
                //  container.removeEventListener("mousemove", onMouseMove);
                enableMouseMove = false;
                if (_state == Status.SEE) {
                    return;
                }
                controls.enabled = true;

                if (_selected && _selected.object.type === PointTypes.CORNER) {
                    if (_selected.object !== undefined && _selected.object != selectedObj) {
                        selectedObj = _selected.object;
                        selectedObj.enabled = true;
                        transformControls.detach();
                        transformControls.attach(selectedObj);
                        instance.dispatchEvent(new Events(HzEvent.SELECT_POINT_ROUTE, selectedObj));
                    }
                }

                //        _selected = null;
                if (_state != Status.DRAW) {
                    //renderer.domElement.style.cursor = 'auto';
                }

                if (e.button === 0 && e.shiftKey === true) {
                    var point = getMousePosition(e);
                    if (point && _state == Status.DRAW) {
                        var target = getSelectedTarget(e);
                        draw(target, point);
                        instance.dispatchEvent(new Events(HzEvent.ADD_POINT_ROUTE, _endPoint));
                    }
                    _moved = false;
                }
                //hideTip();
            }
            var dragObject = function(pos) {
                //      renderer.domElement.style.cursor = 'move';
                //	var subVector = new THREE.Vector3().subVectors(_selected.object.position, _selected.object.prevPoint);
                // if (_selected.object.name == ObjTypes.LINE) {
                //     subVector = new THREE.Vector3().subVectors(pos, _selected.object.prevPoint);
                //     var p1 = _selected.object.point1;
                //     var p2 = _selected.object.point2;
                //
                //     if (p1) {
                //         p1.position.addVectors(p1.position, subVector);
                //         updateObject(p1);
                //
                //         if (p1.type != PointTypes.CUT)
                //             p1.prevPoint.copy(p1.position);
                //     }
                //
                //     if (p2) {
                //         p2.position.addVectors(p2.position, subVector);
                //         updateObject(p2);
                //
                //         if (p2.type != PointTypes.CUT)
                //             p2.prevPoint.copy(p2.position);
                //     }
                // } else {
                //     _selected.object.position.copy(pos);
                //     updateObject(_selected.object);
                // }
                //
                // if (_selected.object.type != PointTypes.CUT) {
                //     _selected.object.prevPoint.copy(_selected.object.position);
                // }
                //
                //
                // if (_selected.object.name == ObjTypes.LINE) {
                //     _selected.object.prevPoint.copy(pos);
                // }
                //
                moveNode.position.copy(pos);
                updateObject(moveNode);


            };
            var addCutPointToLine = function(line, cPoint) {
                var p = addNode(cPoint, PointTypes.CUT);

                //起始点
                var sp = line.getSP();
                //终止点
                var ep = line.getEP();
                var c1, c2;
                //边线

                if (line.type == LineTypes.SIDE) {

                    c1 = new THREE.Vector3((sp.x + cPoint.x) / 2, 0, (sp.z + cPoint.z) / 2);
                    c2 = new THREE.Vector3((cPoint.x + ep.x) / 2, 0, (cPoint.z + ep.z) / 2);

                } else if (line.type == LineTypes.CURVE2 || line.type == LineTypes.CURVE3) {

                    var ps = getControlPoint(line, cPoint, sp, ep);
                    c1 = ps.p1;
                    c2 = ps.p2;
                }
                //将当前曲线分割为两条曲线
                //	p.line1 = line.type == LineTypes.SIDE ? addCurve2(sp, c1, cPoint) : addCurve3(sp, line.curve.v1, c1, cPoint);
                if (line.type == LineTypes.SIDE || (line.point1 && line.point1.type == PointTypes.CORNER)) {
                    p.line1 = addCurve2(sp, c1, cPoint);
                } else if (line.point1 && line.point1.type == PointTypes.CUT) {

                    p.line1 = addCurve3(sp, line.curve.v1, c1, cPoint);
                    if (line.point1.handle)
                        line.point1.handle.p2.line = p.line1;
                }

                p.line1.point1 = line.point1;
                p.line1.point2 = p;
                line.point1.line2 = p.line1;

                //	p.line2 = line.type == LineTypes.SIDE ? addCurve2(cPoint, c2, ep) : addCurve3(cPoint, c2, line.curve.v2, ep);
                if (line.type == LineTypes.SIDE || (line.point2 && line.point2.type == PointTypes.CORNER))
                    p.line2 = addCurve2(cPoint, c2, ep);
                else if (line.point2 && line.point2.type == PointTypes.CUT) {

                    var v2 = line.type == LineTypes.CURVE2 ? line.curve.v1 : line.curve.v2;
                    p.line2 = addCurve3(cPoint, c2, v2, ep);
                    if (line.point2.handle)
                        line.point2.handle.p1.line = p.line2;
                }

                p.line2.point1 = p;
                p.line2.point2 = line.point2;
                line.point2.line1 = p.line2;

                //创建控制柄
                p.handle = makeHandle(c1, c2, p);
                scene.add(p);

                scene.remove(line);
                line.geometry.dispose();
                line = null;
            };
            /**
             * 在线段中添加一个控制拐点
             * @param {*} line 
             * @param {*} cPoint 
             */
            var addCornerPoint = function(line, cPoint) {
                var p = addMidNode(cPoint, PointTypes.CORNER);

                var lastNode = line.point2;
                var lastIndex = _nodeList.indexOf(lastNode);

                _nodeList.splice(lastIndex, 0, p);


                //起始点
                var sp = line.getSP();
                //终止点
                var ep = line.getEP();
                //  var c1, c2;
                //边线

                var addLine = addSideLine(new THREE.Vector3().copy(cPoint), ep.clone()); //添加一条新的线段

                //设置新节点相关联的线段
                p.line1 = line;
                p.line2 = addLine;


                addLine.point2 = line.point2; //将新线段的结束点设置成老线段的结束点

                //line.geometry.vertices[1].copy(cPoint); //修改老线段的结束位置
                //updateObjectVertices(line);
                line.setEnd(cPoint.clone());

                line.point2.line1 = addLine; //将原始线段结束点的开始线段设置成新的节点

                //将原始线段的结束点设置成新的节点
                line.point2 = p;

                addLine.point1 = p; //将新线段的开始节点设置成新节点

                //  _selected.object = p;

                moveNode = p;
                currObj = p;
                transformControls.detach();
                transformControls.attach(p);
                var e1 = new Events(HzEvent.ADD_POINT_ROUTE_ONLINE, p);
                instance.dispatchEvent(e1);

                mouseOverMesh.visible = false;
                mouseOverMesh.line = null;

            };
            var convertStart = function(obj) {
                obj.enabled = false;
                _state = Status.CONVERT;

                //                renderer.domElement.addEventListener("mousemove", convertNode);
                //                renderer.domElement.addEventListener("mouseup", convertOver);

                if (obj.handle) {
                    setHandleVisible(obj, false);
                }

            };
            var convertNode = function(e) {
                if (_state == Status.CONVERT && currObj) {
                    _converted = true;
                    //转换节点
                    currObj.moved = true;
                    var cp = new THREE.Vector3().copy(currObj.position);
                    var c1 = getMousePosition(e);
                    if (!c1) return;
                    var c2 = getSibCPoint(cp, c1, c1.distanceTo(cp));


                    if (!currObj.handle && c1.distanceTo(cp) > 0 && !isNaN(c2.x) && !isNaN(c2.z)) {

                        if (currObj.line1) {
                            var sp = currObj.line1.getSP();
                            var ep = currObj.line1.getEP();

                            var p1 = currObj.line1.point1;
                            var p2 = currObj.line1.point2;
                            removeLine(currObj.line1);
                            currObj.line1 = addSideLine(sp, ep);
                            currObj.line1.point1 = p1;
                            currObj.line1.point2 = p2;
                            p1.line2 = currObj.line1;
                            p2.line1 = currObj.line1;

                            //	currObj.line1.geometry.dispose();
                            //	currObj.line1.geometry = new THREE.Geometry();

                            if (currObj.line1.type == LineTypes.SIDE) {
                                currObj.line1.geometry.vertices = makeCurve2Points(sp, c1, ep, currObj.line1);
                            } else {
                                currObj.line1.geometry.vertices = makeCurve3Points(sp, c1, currObj.line1.curve.v1, ep, currObj.line1);
                            }
                            updateObjectVertices(currObj.line1);

                        }
                        var c2;
                        if (currObj.line2) {
                            if (!currObj.line1) {
                                c2 = c1;
                                c1 = null;
                            }

                            var sp = currObj.line2.getSP(),
                                ep = currObj.line2.getEP();

                            //	currObj.line2.geometry.dispose();
                            //	currObj.line2.geometry = new THREE.Geometry();
                            var p1 = currObj.line2.point1;
                            var p2 = currObj.line2.point2;
                            removeLine(currObj.line2);
                            currObj.line2 = addSideLine(sp, ep);
                            currObj.line2.point1 = p1;
                            currObj.line2.point2 = p2;
                            p2.line1 = currObj.line2;
                            p1.line2 = currObj.line2;

                            if (currObj.line2.type == LineTypes.SIDE) {
                                currObj.line2.geometry.vertices = makeCurve2Points(sp, c2, ep, currObj.line2);
                            } else {
                                //var v = currObj.line2.type == LineTypes.CURVE2 ?
                                currObj.line2.geometry.vertices = makeCurve3Points(sp, currObj.line2.curve.v1, c2, ep, currObj.line2);
                            }
                            updateObjectVertices(currObj.line2);
                        } else {
                            c2 = null;
                        }


                        var handle = makeHandle(c1, c2, currObj);
                        currObj.handle = handle;
                        currObj.type = PointTypes.CUT;
                    } else if (currObj.handle) {

                        setHandleVisible(currObj, true);

                        if (currObj.handle.p2) {
                            if (currObj.handle.p1) {
                                currObj.handle.p2.cLine.geometry.vertices[1].copy(c1);
                                currObj.handle.p2.cLine.geometry.verticesNeedUpdate = true;
                            } else {
                                currObj.handle.p2.position.copy(c1);
                                updateObject(currObj.handle.p2);
                            }
                        }

                        if (currObj.handle.p1) {
                            currObj.handle.p1.position.copy(c1);
                            updateObject(currObj.handle.p1);
                        }

                    }
                }
            };
            var convertToCorner = function(p) {
                p.type = PointTypes.CORNER;
                if (p.handle) {
                    removeHandle(p);
                }
                var v0, v1;
                if (p.line1) {

                    v0 = p.line1.geometry.vertices[0];
                    v1 = p.line1.geometry.vertices[p.line1.geometry.vertices.length - 1];
                    p.line1.geometry.dispose();
                    p.line1.geometry = new THREE.Geometry();
                    p.line1.geometry.vertices = [v0, v1];
                    //updateObjectVertices(p.line1);
                    p.line1.type = LineTypes.SIDE;
                }

                if (p.line2) {

                    v0 = p.line2.geometry.vertices[0];
                    v1 = p.line2.geometry.vertices[p.line2.geometry.vertices.length - 1];
                    p.line2.geometry.dispose();
                    p.line2.geometry = new THREE.Geometry();
                    p.line2.geometry.vertices = [v0, v1];
                    //updateObjectVertices(p.line2);
                    p.line2.type = LineTypes.SIDE;
                }
            };

            var convertOver = function(e) {
                //        renderer.domElement.removeEventListener("mousemove", convertNode);

                //        renderer.domElement.removeEventListener("mouseup", convertOver);
                _state = Status.EDIT;

                if (e.shiftKey && !_converted && currObj && currObj.type == PointTypegetPointss.CUT) {
                    convertToCorner(currObj);
                }
                _converted = false;
            };

            var draw = function(target, point) {
                var position, p, line;
                if (target && (target.object.type == PointTypes.CUT || target.object.type == PointTypes.CORNER)) {
                    position = target.object.position;
                    p = target.object;

//                    renderer.domElement.style.cursor = 'auto';

                    if (p == _startPoint) //形成闭环
                    {

                        p.line1 = _objects[_objects.length - 1];
                        p.line1.point2 = _startPoint;
                        updateObjectVertices(p.line1);
                        if (_state == Status.DRAW && _currLine) {
                            if (p) {
                                _currLine.geometry.vertices[1].copy(new THREE.Vector3(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z)));
                                _currLine.geometry.verticesNeedUpdate = _currLine.matrixWorldNeedsUpdate = true;

                            }
                        }

                    } else {
                        // if (p === _objects[_objects.length - 2]) {
                        //     p.line2 = null;
                        //
                        // }
                        // if (p !== _objects[_objects.length - 2]) //形成闭环 但不是最后一个点
                        // {
                        //     p.line3 = _currLine; //多挂一条线段
                        //     updateObjectVertices(p.line3);
                        // }
                        // _currLine = _objects[_objects.length - 1];
                        _currLine = _nodeList[_nodeList.length - 1].line2;
                    }


                    //            _state = Status.EDIT;

                } else
                if (_nodeList.length > 0) {
                    _currLine = _nodeList[_nodeList.length - 1].line2;
                }

                position = new THREE.Vector3(parseFloat(point.x), parseFloat(point.y), parseFloat(point.z));

                if (position) {
                    if (!p) {
                        p = addNode(position, PointTypes.CORNER);
                        line = addSideLine(new THREE.Vector3().copy(position), new THREE.Vector3(position.x + 1, position.y + 1, position.z + 1));
                        line.point1 = p;
                        p.line2 = line;

                        if (!_startPoint)
                            _startPoint = p;


                        if (_currLine) {
                            // _currLine.geometry.vertices[1].copy(position);
                            // updateObjectVertices(_currLine);
                            _currLine.setEnd(position.clone());
                            _currLine.point2 = p;
                            p.line1 = _currLine;


                        }

                    }


                }

                //_currLine = line;
                //     _currLine = _objects[_objects.length - 1];
                //   _currLine = _nodeList[_nodeList.length-1].line2;

            };

            var setSelectedStyle = function(object) {
                if (currObj) {
                    // currObj.material.setValues({
                    //     color: defaultColor
                    // });
                    // currObj.material.needsUpdate = true;

                    if (currObj.type == LineTypes.CURVE2 || currObj.type == LineTypes.CURVE3) {

                        if (currObj.point1) {
                            setHandleVisible(currObj.point1, false);
                        }
                        if (currObj.point2) {
                            setHandleVisible(currObj.point2, false);
                        }
                    } else if (currObj.name == "point") {
                        if (currObj.type == PointTypes.CUT)
                            setHandleVisible(currObj, false);

                        if (currObj.line1 && currObj.line1 && currObj.line1.point1)
                            setHandleVisible(currObj.line1.point1, false);

                        if (currObj.line1 && currObj.line2 && currObj.line2.point2)
                            setHandleVisible(currObj.line2.point2, false);
                    }
                }

                // object.material.setValues({
                //     color: object.name == ObjTypes.POINT ? selectedColor : 0x057ee9
                // });
                // object.material.needsUpdate = true;
                currObj = object;

                if (object.type == LineTypes.CURVE2 || object.type == LineTypes.CURVE3) {

                    if (object.point1) {
                        setHandleVisible(object.point1, true, "p2");
                        //setHandleVisible(object.point1, false, "p1");
                    }
                    if (object.point2) {
                        setHandleVisible(object.point2, true, "p1");
                        //setHandleVisible(object.point1, false, "p2");
                    }
                } else if (object.name == "point") {
                    if (object.type == PointTypes.CUT)
                        setHandleVisible(object, true);

                    if (object.line1 && object.line1.point1)
                        setHandleVisible(object.line1.point1, true, "p2");
                    if (object.line2 && object.line2.point2)
                        setHandleVisible(object.line2.point2, true, "p1");
                }
            };

            var removeLine = function(line) {
                if (line.point1) {
                    if (line.point1.line1 == line)
                        line.point1.line1 = null;
                    else
                        line.point1.line2 = null;
                }

                //removeControlPoint(line.point1);

                if (line.point2) {
                    if (line.point2.line1 == line)
                        line.point2.line1 = null;
                    else
                        line.point2.line2 = null;
                }

                //removeControlPoint(line.point2);

                line.geometry.dispose();
                scene.remove(line);
                _objects.remove(line);
                line = null;
            };

            var removeControlPoint = function(point) {
                if (point.type == PointTypes.CUT) {
                    if (point.line1 == null && point.handle)
                        removeHandle(point, "p1");
                    if (point.line2 == null && point.handle)
                        removeHandle(point, "p2");

                }
            };
            var removeNode = function(node) {
                var line;
                //相邻两个节点皆为拐点
                if (node.line1 !== undefined && node.line1.hasOwnProperty('point1') === true && node.line2.hasOwnProperty('point2') === true &&
                    node !== _startPoint &&
                    node !== _endPoint &&
                    _nodeList.length >= 2) {
                    if (node.line1 && node.line2 && node.line1.point1.type == PointTypes.CORNER && node.line2.point2.type == PointTypes.CORNER) {
                        //     line = addSideLine(node.line1.geometry.vertices[0], node.line2.geometry.vertices[node.line2.geometry.vertices.length - 1]);
                        line = addSideLine(node.line1.start, node.line2.end);
                    }
                }

                //当前结点为拐点
                //if (node.type == PointTypes.CORNER) {
                var sp;

                if (node.line1 && node.line2) {
                    var p1 = node.line1.point1;
                    var p2 = node.line2.point2;
                    var sp = node.line1.getSP();
                    var ep = node.line2.getEP();


                    // if (p1!==undefined&&p2!==undefined&&p1.type == PointTypes.CUT && p2.type == PointTypes.CUT) {
                    //
                    //     line = addCurve3(sp, node.line1.curve.v1, node.line2.curve.v2, ep);
                    //     p2.handle.p1.line = line;
                    //     p1.handle.p2.line = line;
                    //
                    // } else if (p1!==undefined&&p1.type == PointTypes.CUT) {
                    //
                    //     //上一条线段为二次曲线，下一条为直线
                    //     line = addCurve2(sp, node.line1.curve.v1, ep);
                    //     p1.handle.p2.line = line;
                    //
                    // } else if (p2!==undefined&&p2.type == PointTypes.CUT) {
                    //
                    //     //下一条线段为二次曲线，上一条为直线
                    //     var cp = node.line2.type == LineTypes.CURVE2 ? node.line2.curve.v1 : node.line2.curve.v2;
                    //     line = addCurve2(sp, cp, ep);
                    //     p2.handle.p1.line = line;
                    //
                    // }

                }
                // //当前结点为切点
                // //}
                // if (node.type == PointTypes.CUT) {
                //
                //     if (node.handle) {
                //         removeHandle(node);
                //         node.handle = null;
                //
                //     }
                // }

                //关联新线段
                if (line) {
                    line.point1 = p1;
                    line.point2 = p2;

                    p1.line2 = line;
                    p2.line1 = line;
                }
                //
                //回收与被删除节点相连的线段
                if (node.line1 && !node.line2 && p1) {
                    p1.line2 = null;
                    if (p1.handel && p1.handel.p2)
                        p1.handel.p2.line = null;

                } else if (node.line2 && !node.line1 && p2) {
                    p2.line1 = null;
                    if (p2.handel && p2.handel.p1)
                        p2.handel.p1.line = null;
                }

                if (node.line2 !== null && node.line2 === _objects[_objects.length - 1]) //删除最后一个点
                {
                    if (node.line2) {
                        scene.remove(node.line2);
                        _objects.remove(node.line2);
            
                        node.line2.dispose();
                        node.line2 = null;
                    }


                    _currLine = node.line1;
                    if (_currLine) {
                        var lastnode = _nodeList[_nodeList.length - 1];
                        //  _endPoint = lastnode;
                        
                    //    _currLine.geometry.vertices[1].copy(lastnode.position);
                        _currLine.setEnd(lastnode.position);
                        updateObjectVertices(_currLine);



                    }


                } else {


                    if (node.line2) {
                        if (node === _startPoint) {
                            _startPoint = node.line2.point2;
                        }
                        scene.remove(node.line2);
                        _objects.remove(node.line2);
                        //   node.line2.geometry.dispose();
                        node.line2.dispose();
                        node.line2 = null;

                    }
                    if (node.line1) {
                        scene.remove(node.line1);
                        _objects.remove(node.line1);
                        // node.line1.geometry.dispose();
                        node.line1.dispose();
                        node.line1 = null;
                    }
                }

                scene.remove(node);
                _objects.remove(node);
                //  _currLine = _objects[_objects.length-1];
                node = null;
                _selected = null;
            };

            var getSelectedTarget = function(e) {


                _mouse.x = (e.clientX / stageW) * 2 - 1;
                _mouse.y = -(e.clientY / stageH) * 2 + 1;

                _raycaster.setFromCamera(_mouse, camera);

                var intersects = _raycaster.intersectObjects(_objects.concat([plane]), true); //

                // var ray = _raycaster.ray;
                //     var normal = ray.direction; // normal ray to the camera position

                if (intersects.length > 0) {
                    var point, line;
                    for (var i = 0, length = intersects.length; i < length; i++) {
                        var type = intersects[i].object.type;
                        var name = intersects[i].object.name;

                        if (name == ObjTypes.POINT) {
                            point = intersects[i];
                        } else if (name == ObjTypes.LINE && type != LineTypes.AUX || (name == 'mouseover_mesh' && intersects[i].object.visible === true)) {
                            line = intersects[i];

                        }

                    }

                    if (point) {
                        return point;
                    } else if (line) {
                        return line;
                    }


                } else {
                    return null;
                }
            };
            var getMousePosition = function(e) {
                //      e.preventDefault();
                if (enable === false) {
                    return null;
                }
                _mouse.x = (e.clientX / stageW) * 2 - 1;
                _mouse.y = -(e.clientY / stageH) * 2 + 1;
                _raycaster.setFromCamera(_mouse, camera);
                var intersects = _raycaster.intersectObjects(scene.children, true); //
                if (intersects.length > 0) {
                    return new THREE.Vector3(intersects[0].point.x, intersects[0].point.y + 10, intersects[0].point.z);
                }


            };
            var getMouseLine = function(e) {
                //      e.preventDefault();
                if (enable === false) {
                    return null;
                }
                _mouse.x = (e.clientX / stageW) * 2 - 1;
                _mouse.y = -(e.clientY / stageH) * 2 + 1;
                _raycaster.setFromCamera(_mouse, camera);
                var intersects = _raycaster.intersectObjects(_objects, false);
                if (intersects.length > 0) {
                    return intersects[0];
                } else {
                    return null;
                }


            };
            var updateObject = function(object) {
                var type = object.type;
                if (object.name == ObjTypes.POINT) {
                    if (type == PointTypes.CUT) //更新切点
                    {
                        updateCutPoint(object);
                    } else if (type == PointTypes.CORNER) //更新拐点
                    {
                        updateCorner(object);
                    } else //更新控制点
                    {
                        updateControlPoint(object);
                    }


                } else if (object.name == ObjTypes.LINE) { //更新线段
                    updateLine(object);
                }
            };
            var updateLine = function(line) {
                if (line.subVector) {
                    if (line.point1) {
                        line.point1.position.addVectors(line.point1.position, line.subVector);
                        updateObject(line.point1);
                    }
                    if (line.point2) {
                        line.point2.position.addVectors(line.point2.position, line.subVector);
                        updateObject(line.point2);
                    }
                    line.subVector = null;
                }
            };

            var updateCutPoint = function(p) {
                var subVector = new THREE.Vector3().subVectors(p.position, p.prevPoint);
                var curve;
                if (p.line1) {
                    if (p.line1.curve) {
                        curve = p.line1.curve;

                        if (p.line1.type == LineTypes.CURVE3) {

                            curve.v3.copy(p.position);
                            curve.v2.addVectors(curve.v2, subVector);

                        } else {
                            curve.v2.copy(p.position);
                            curve.v1.addVectors(curve.v1, subVector);
                        }
                        //p.line1.geometry = new THREE.Geometry();
                        p.line1.geometry.vertices = curve.getPoints(count);
                        p.line1.curve = curve;
                    } else
                        p.line2.geometry.vertices[1].copy(p.position);

                    updateObjectVertices(p.line1);
                }
                if (p.line2) {
                    if (p.line2.curve) {
                        curve = p.line2.curve;
                        curve.v0.copy(p.position);
                        curve.v1.addVectors(curve.v1, subVector);

                        //length = curve.v0.distanceTo(curve.v1) + curve.v1.distanceTo(curve.v2) + curve.v2.distanceTo(curve.v3);
                        p.line2.geometry.vertices = curve.getPoints(count);
                    } else {
                        p.line2.geometry.vertices[0].copy(p.position);
                    }

                    updateObjectVertices(p.line2);
                }

                if (p.handle)
                    updateHandle(p, subVector);
                p.prevPoint.copy(p.position);
            };
            var updateObjectVertices = function(line) {
                if (line instanceof DiyLine) return;
                line.geometry.verticesNeedUpdate = line.matrixWorldNeedsUpdate = true;
                line.geometry.computeBoundingBox();
                line.geometry.computeBoundingSphere();
            };
            var updateCorner = function(p) {
                if (p.line1) {
                    if (p.line1.type == LineTypes.SIDE) {
                        // p.line1.geometry.vertices[1].copy(p.position);

                        p.line1.setEnd(p.position.clone());

                    } else if (p.line1.type == LineTypes.CURVE3) {

                        p.line1.curve.v3.copy(p.position);
                        p.line1.geometry.vertices = p.line1.curve.getPoints(count);

                    } else {
                        p.line1.curve.v2.copy(p.position);
                        p.line1.geometry.vertices = p.line1.curve.getPoints(count);
                    }

                    updateObjectVertices(p.line1);

                }

                if (p.line2) {
                    if (p.line2.type == LineTypes.SIDE)
                        if (p === _endPoint) {
                            // p.line2.geometry.vertices[0].copy(p.position);
                            // p.line2.geometry.vertices[1].copy(p.position);
                            p.line2.setStart(p.position.clone());
                            p.line2.setEnd(p.position.clone());
                        } else {
                            //p.line2.geometry.vertices[0].copy(p.position);
                            p.line2.setStart(p.position.clone());
                        }

                    else {

                        p.line2.curve.v0.copy(p.position);
                        p.line2.geometry.vertices = p.line2.curve.getPoints(count);
                    }
                    updateObjectVertices(p.line2);
                }

                if (p.line3) {
                    if (p.line3.type == LineTypes.SIDE)
                        p.line3.geometry.vertices[1].copy(p.position);
                    updateObjectVertices(p.line3);
                }
            };
            var updateControlPoint = function(p) {
                if (p.cLine)
                    p.cLine.geometry.vertices[1].copy(p.position);
                if (p.line) {
                    if (p.line.type == LineTypes.CURVE2)
                        p.line.curve.v1.copy(p.position);
                    else {
                        if (p.cutPoint.line1 == p.line)
                            p.line.curve.v2.copy(p.position);
                        else
                            p.line.curve.v1.copy(p.position);
                    }

                    p.line.geometry.vertices = p.line.curve.getPoints(count);
                    p.cLine.geometry.verticesNeedUpdate = true;
                    updateObjectVertices(p.line);

                }

                if (p.sib) {
                    var sp = new THREE.Vector3().copy(p.cLine.geometry.vertices[0]);
                    var subVec = new THREE.Vector3().subVectors(sp, new THREE.Vector3().copy(p.position)).normalize();
                    var vec = subVec.multiplyScalar(p.sib.cLine.getSP().distanceTo(p.sib.cLine.getEP()));
                    var sibPoint = vec.addVectors(vec, sp);

                    p.sib.position.copy(sibPoint);
                    p.sib.prevPoint.copy(sibPoint);
                    if (p.sib.cLine) {
                        p.sib.cLine.geometry.vertices[1].copy(sibPoint);
                        p.sib.cLine.geometry.verticesNeedUpdate = true;
                    }

                    if (p.sib.line) {
                        if (p.sib.line.type == LineTypes.CURVE2)
                            p.sib.line.curve.v1.copy(sibPoint);
                        else {
                            if (p.sib.cutPoint.line1 == p.sib.line)
                                p.sib.line.curve.v2.copy(sibPoint);
                            else
                                p.sib.line.curve.v1.copy(sibPoint);
                        }
                        p.sib.line.geometry.vertices = p.sib.line.curve.getPoints(count);
                        updateObjectVertices(p.sib.line);
                    }

                }
            };
            var makeHandle = function(c1, c2, p) {
                var p1, p2, line1, line2;
                if (p.line1 && c1) {

                    p1 = addControlPoint(c1);
                    line1 = addAuxLine(p.position, c1);

                    p1.line = p.line1;
                    p1.cLine = line1;
                    p1.cutPoint = p;

                    scene.add(p1);
                    scene.add(line1);
                }

                if (p.line2 && c2) {
                    p2 = addControlPoint(c2);
                    line2 = addAuxLine(p.position, c2);

                    p2.line = p.line2;
                    p2.cLine = line2;
                    p2.cutPoint = p;

                    scene.add(p2);
                    scene.add(line2);
                }

                if (p1 && p2) {
                    p1.sib = p2;
                    p2.sib = p1;
                }

                return {
                    p1: p1,
                    p2: p2,
                    line1: line1,
                    line2: line2
                }
            };
            var updateHandle = function(p, subVector) {
                var vertices;
                if (p.handle.p1) {
                    p.handle.p1.position = p.handle.p1.position.addVectors(p.handle.p1.position, subVector);
                    p.handle.p1.prevPoint.copy(p.handle.p1.position);
                    vertices = p.handle.p1.cLine.geometry.vertices;
                    vertices[0].addVectors(vertices[0], subVector);
                    vertices[1].addVectors(vertices[1], subVector);
                    p.handle.p1.cLine.geometry.verticesNeedUpdate = true;

                }
                if (p.handle.p2) {
                    p.handle.p2.position = p.handle.p2.position.addVectors(p.handle.p2.position, subVector);
                    p.handle.p2.prevPoint.copy(p.handle.p2.position);
                    vertices = p.handle.p2.cLine.geometry.vertices;
                    vertices[0].addVectors(vertices[0], subVector);
                    vertices[1].addVectors(vertices[1], subVector);
                    p.handle.p2.cLine.geometry.verticesNeedUpdate = true;
                }
            };
            var removeHandle = function(p, type) {
                type = type || "";

                if (p.handle.p1 && (type == "p1" || type == "")) {
                    scene.remove(p.handle.p1);
                    scene.remove(p.handle.p1.cLine);

                    p.handle.p1.cLine.geometry.dispose();
                    p.handle.p1.cLine = null;
                    p.handle.p1 = null;
                    if (p.handle.p2)
                        p.handle.p2.sib = null;

                }
                if (p.handle.p2 && (type == "p2") || type == "") {
                    scene.remove(p.handle.p2);
                    scene.remove(p.handle.p2.cLine);

                    p.handle.p2.cLine.geometry.dispose();
                    p.handle.p2.cLine = null;
                    p.handle.p2 = null;
                    if (p.handle.p1)
                        p.handle.p1.sib = null;
                }

                if (!p.handle.p1 && !p.handle.p2)
                    p.handle = null;
            };

            var addCurve3 = function(v0, v1, v2, v3) {
                var curve = new THREE.CubicBezierCurve3(new THREE.Vector3().copy(v0), v1, v2, new THREE.Vector3().copy(v3));
                var length = v0.distanceTo(v1) + v1.distanceTo(v2) + v2.distanceTo(v3);
                var geometry = new THREE.Geometry();
                geometry.vertices = curve.getPoints(count);
                var material = new THREE.LineBasicMaterial({
                    color: defaultColor,
                    linewidth: 3
                });
                var line = new THREE.Line(geometry, material);
                line.type = LineTypes.CURVE3;
                line.curve = curve;
                line.name = ObjTypes.LINE;
                scene.add(line);
                _objects.push(line);
                line.prevPoint = new THREE.Vector3().copy(line.position);
                return line;
            };
            var addCurve2 = function(v0, v1, v2) {
                var curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3().copy(v0), v1, new THREE.Vector3().copy(v2));
                var length = v0.distanceTo(v1) + v1.distanceTo(v2);
                var geometry = new THREE.Geometry();
                geometry.vertices = curve.getPoints(count);
                var material = new THREE.LineBasicMaterial({
                    color: defaultColor
                });
                var line = new THREE.Line(geometry, material);
                line.type = LineTypes.CURVE2;
                line.curve = curve;
                line.name = ObjTypes.LINE;
                scene.add(line);
                _objects.push(line);
                line.prevPoint = new THREE.Vector3().copy(line.position);
                return line;
            };
            var makeCurve2Points = function(v0, v1, v2, target) {
                var curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3().copy(v0), v1, new THREE.Vector3().copy(v2));
                var length = v0.distanceTo(v1) + v1.distanceTo(v2);
                if (target) {
                    target.curve = curve;
                    target.type = LineTypes.CURVE2;
                }
                return curve.getPoints(count);
            };

            var makeCurve3Points = function() {
                var curve = new THREE.CubicBezierCurve3(new THREE.Vector3().copy(v0), v1, v2, new THREE.Vector3().copy(v3));
                var length = v0.distanceTo(v1) + v1.distanceTo(v2) + v2.distanceTo(v3);
                if (target) {
                    target.curve = curve;
                    target.type = LineTypes.CURVE3;
                }
                return curve.getPoints(count);
            };

            var addSideLine = function(v0, v1) {
                v0 = new THREE.Vector3().copy(v0);
                v1 = new THREE.Vector3().copy(v1);

                // var geometry = new THREE.Geometry();
                // geometry.vertices.push(v0, v1);
                // var material = new THREE.LineBasicMaterial({
                //     color: 0xFF0000,
                //     // dashSize: 10,
                //     // gapSize: 10,
                //     depthTest: true

                // });
                // var line = new THREE.Line(geometry, material);
                var line = new DiyLine(v0, v1);
                line.type = LineTypes.SIDE;
                line.name = ObjTypes.LINE;
                scene.add(line);
                _objects.push(line);
                line.prevPoint = new THREE.Vector3().copy(line.position);
                return line;
            };

            var addAuxLine = function(v0, v1) {
                v0 = new THREE.Vector3().copy(v0);
                v1 = new THREE.Vector3().copy(v1);

                var geometry = new THREE.Geometry();
                geometry.vertices.push(v0, v1);
                var material = new THREE.LineBasicMaterial({
                    color: defaultColor,
                    linewidth: 3
                });
                var line = new THREE.Line(geometry, material);
                line.type = LineTypes.AUX;
                line.name = ObjTypes.LINE;
                scene.add(line);
                return line;
            };
            var addNode = function(position, type) {
                var geometry = new THREE.SphereBufferGeometry(10, 32, 32);
                var node = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                    color: defaultColor
                }));
                node.material.ambient = node.material.color;
                node.position.copy(position);
                node.type = type;
                node.name = ObjTypes.POINT;
                node.prevPoint = new THREE.Vector3().copy(position);
                node.enabled = true;
                scene.add(node);
                _objects.push(node);
                _nodeList.push(node);
                _endPoint = node;
                return node;
            };
            /**
             * 添加一个中间节点
             */
            var addMidNode = function(position, type) {
                var geometry = new THREE.SphereBufferGeometry(10, 32, 32);
                var node = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                    color: defaultColor
                }));
                node.material.ambient = node.material.color;
                node.position.copy(position);
                node.type = type;
                node.name = ObjTypes.POINT;
                node.prevPoint = new THREE.Vector3().copy(position);
                node.enabled = true;
                scene.add(node);
                _objects.push(node);
                // _nodeList.push(node);
                // _endPoint = node;
                return node;
            }
            var addControlPoint = function(position) {
                var geo = new THREE.SphereGeometry(6, 10, 10)
                var point = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
                    color: defaultColor
                }));
                point.type = PointTypes.CONTROL;
                point.name = ObjTypes.POINT;
                point.material.ambient = point.material.color;
                point.position.copy(position);
                point.enabled = true;
                scene.add(point);
                _objects.push(point);
                point.prevPoint = new THREE.Vector3().copy(position);
                return point;
            };
            var getControlPoint = function() {
                center.y = 0;
                //控制点
                var cp = new THREE.Vector3().copy(line.curve.v1);

                //控制柄单边长度
                var cLength = 10;
                //曲线点集合
                var points = line.curve.getPoints(count);
                //中心点下一个点的坐标
                var np = points[getPointIndex(points, center) + 1];
                //斜率
                var k = (np.z - center.z) / (np.x - center.x);
                console.log("中心点斜率 : " + k)
                var b = center.z - k * center.x;

                //控制柄端点1
                var po1 = new THREE.Vector3(center.x + cLength, 0, 0);
                po1.z = k * po1.x + b;
                po1 = multiplyScalar(po1, center, cLength);

                //控制柄端点2
                var po2 = new THREE.Vector3(center.x - cLength, 0, 0);
                po2.z = k * po2.x + b;
                po2 = multiplyScalar(po2, center, cLength);

                var p1, p2;
                if (po1.distanceTo(line.point1.position) < po2.distanceTo(line.point1.position)) {
                    p1 = po1;
                    p2 = po2;
                } else {
                    p1 = po2;
                    p2 = po1;
                }
                if (p1.distanceTo(sp) < p1.distanceTo(ep))
                    return {
                        p1: p1,
                        p2: p2
                    };
                else
                    return {
                        p1: p2,
                        p2: p1
                    };
            };
            var getPointIndex = function(points, center) {
                for (var i = 0, length = points.length; i < length; i++) {
                    if (center.x.toFixed(1) == points[i].x.toFixed(1) && center.z.toFixed(1) == points[i].z.toFixed(1))
                        return i;
                }
                var d = 10000,
                    index;
                for (var i = 0, length = points.length; i < length; i++) {
                    if (center.distanceTo(points[i]) < d) {
                        d = center.distanceTo(points[i]);
                        index = i;
                    }
                }
                return index;
            };
            var getSibCPoint = function(center, c1, cLength) {
                //斜率
                var k = (c1.z - center.z) / (c1.x - center.x);
                //console.log("斜率 : " + k)
                var b = center.z - k * center.x;

                //控制柄端点1
                var p = new THREE.Vector3(center.x + cLength, 0, 0);
                p.z = k * p.x + b;

                var subVec = new THREE.Vector3().subVectors(center, p).normalize();
                var vec = subVec.multiplyScalar(cLength);

                return vec.addVectors(vec, center);
            };
            var multiplyScalar = function(center, p2, length) {
                var subVec = new THREE.Vector3().subVectors(center, p2).normalize();
                var vec = subVec.multiplyScalar(length);
                return vec.addVectors(vec, center);
            };
            var getCurveCenter = function(position, points, point) {
                var pointsL = points.length,
                    totalL = 0,
                    andL = 0;
                for (var i = 0; i < pointsL; i++) {
                    if (i + 1 < pointsL)
                        totalL += points[i].distanceTo(points[i + 1]);
                }

                var cIndex = getPointIndex(points, point);
                if (position == "pc") {
                    var pl = 0;
                    for (var i = 0; i < cIndex; i++) {
                        if (i + 1 < cIndex)
                            pl += points[i].distanceTo(points[i + 1]);
                    }

                    for (var i = 0; i < cIndex; i++) {
                        if (i + 1 < cIndex)
                            andL += points[i].distanceTo(points[i + 1]);
                        if (andL >= pl / 2) {
                            points[i + 1].index = i + 1;
                            return points[i + 1];
                        }
                    }
                } else if (position == "nc") {
                    var nl = 0;

                    for (var i = cIndex; i < pointsL; i++) {
                        if (i + 1 < pointsL)
                            nl += points[i].distanceTo(points[i + 1]);
                    }

                    for (var i = cIndex; i < pointsL; i++) {
                        if (i + 1 < pointsL)
                            andL += points[i].distanceTo(points[i + 1]);
                        if (andL >= nl / 2) {
                            points[i + 1].index = i + 1;
                            return points[i + 1];
                        }
                    }

                }
            };

            var setHandleVisible = function(p, visible, type) {
                type = type || "";
                if (p && p.handle) {

                    if (type == "" || type == "p1") {
                        if (p.handle.p1)
                            p.handle.p1.visible = visible;
                        if (p.handle.line1)
                            p.handle.line1.visible = visible;

                    }
                    if (type == "" || type == "p2") {

                        if (p.handle.p2)
                            p.handle.p2.visible = visible;
                        if (p.handle.line2)
                            p.handle.line2.visible = visible;
                    }
                }
            };
            var getCrossPoint = function(p1, p2, p3, p4) {
                var A1 = p2.z - p1.z;
                var B1 = p1.x - p2.x;
                var C1 = (p2.x - p1.x) * p1.z - (p2.z - p1.z) * p1.x;

                var A2 = p4.z - p3.z;
                var B2 = p3.x - p4.x;
                var C2 = (p4.x - p3.x) * p3.z - (p4.z - p3.z) * p3.x;
                var d = A1 * B2 - A2 * B1;
                if (d !== 0) {
                    return new THREE.Vector3((B1 * C2 - C1 * B2) / d, 0, (A2 * C1 - A1 * C2) / d);

                }
            };
            var showTip = function(e, msg) {
                if (msg) {
                    var offsetY = e.pageY - parseInt(getStyle(instance.container, 'top'));
                    var offsetX = e.pageX - parseInt(getStyle(instance.container, 'left'));
                    _tip.innerText = msg;
                    _tip.style.display = 'block';
                    _tip.style.left = (offsetX + 10) + 'px';
                    _tip.style.top = (offsetY + 10) + 'px';
                }
            };
            var hideTip = function() {
                _tip.style.display = 'none';
            };
            var orderNodes = function(node) {
                _nodes.push(node);
                if (node.line2 && node.line2.point2 && node.line2.point2 == node) //有可能选中自己
                {
                    return;
                }
                if (node.line2 && node.line2.point2 && node.line2.point2 != _startPoint) {
                    orderNodes(node.line2.point2);
                }
                if (node.line2 && node.line2.point2 && node.line2.point2 === _startPoint) {
                    _nodes.push(_startPoint);
                }
            };
            var getVertices = function(nodes) {
                var list = [];
                for (var i = 0, length = nodes.length; i < length; i++) {
                    var node = nodes[i];
                    var pos = node.position;
                    //    pos.isNode = true;
                    var obj = { x: pos.x, y: pos.y, z: pos.z };
                    list.push(obj);
                    //console.log(pos);
                    // if (node.line1 && node.line1.type != LineTypes.SIDE) {
                    //     pos.line1 = {
                    //         curve: node.line1.curve,
                    //         type: node.line1.type
                    //     };
                    // }
                    //s
                    // if (node.line2 && node.line2.type != LineTypes.SIDE) {
                    //
                    //     pos.line2 = {
                    //         curve: node.line2.curve,
                    //         type: node.line2.type
                    //     };
                    //     if (i > 0 && node === _startPoint) //最后一个点 有可能曲线
                    //     {
                    //         return list;
                    //     }
                    //     node.line2.geometry.vertices.pop(); //形成曲线的最后一个点和开始点很接近 但是是错位的 所以删掉
                    //     list = list.concat(node.line2.geometry.vertices);
                    //     //console.log(node.line2.type);
                    // } else if (node.line2 && i == length - 1) {
                    //     //list.push(nodes[0].position);
                    // }


                }
                return list;
            };

            function onKeyDown(e) {

                if (e.keyCode == 46 && currObj) {
                    if (currObj.type == PointTypes.CORNER || currObj.type == PointTypes.CUT) {
                        transformControls.detach();
                        _nodeList.remove(currObj);
                        var e1 = new Events(HzEvent.DELETE_POINT_ROUTE, currObj);
                        instance.dispatchEvent(e1);
                        if (_nodeList.length === 0) { //最后一个点了全部清除吧
                            instance.clearAll();
                            return;
                        } else if (_nodeList.length > 0) {
                            removeNode(currObj);
                            _startPoint = _nodeList[0];


                        }
                        _endPoint = _nodeList[_nodeList.length - 1];
                        _currLine = _nodeList[_nodeList.length - 1].line2;



                    }

                    //不允许删除线段
                    //    else if (currObj.type == LineTypes.CURVE2 || currObj.type == LineTypes.CURVE3 || currObj.type == LineTypes.SIDE)
                    //      removeLine(currObj);
                }
                // if(e.keyCode==32)
                // {
                //       console.log(JSON.stringify(instance.getRouteList()));
                //
                // }
                if (e.keyCode === 27) { //添加了esc减取消选中的效果
                    transformControls.detach();
                    selectedObj = null;
                }
            }

            var init = function() {
                transformControls.addEventListener('objectChange', nodeChange);
                transformControls.addEventListener('mouseUp', nodeChangeOver);
                transformControls.setMode("translate");
                scene.add(transformControls);

            }();

            instance.enable = function(val) {
                enable = val;
                if (enable === true) {
                    transformControls.setMode("translate");
                    window.addEventListener('keydown', onKeyDown);
                } else {
                    window.removeEventListener('keydown', onKeyDown);
                    instance.clearAll();
                }
            };
            instance.mouseDown = function(e) {
                onMouseDown(e);
            };
            instance.mouseMove = function(e) {
                onMouseMove(e);

            };
            instance.mouseUp = function(e) {
                onMouseUp(e);
            };
            instance.setSize = function(w, h) {
                stageW = w;
                stageH = h;
            };
            /**
             * 重新设定最小高度
             */
            instance.setMinY = function(val) {
                minY = val;
                transformControls.minY = val;
            };
            instance.clearAll = function() {
                for (var i = 0; i < _objects.length; i++) {
                    var temp = _objects[i];
                    scene.remove(temp);

                }
                _objects.removeAll();
                _nodeList.removeAll();
                _currLine = undefined;
                _startPoint = undefined;
                _endPoint = undefined;
                transformControls.detach();
                moveNode = null;
                _selected = null;
                mouseOverMesh.visible = false;
                mouseOverMesh.line = null;
            };
            instance.getRouteList = function() {
                // _nodes = [];
                //
                // if(_startPoint===undefined){ //没有编辑返回空数组
                //    return [];
                // }
                // orderNodes(_startPoint);
                // var pathArr = getVertices(_nodes);
                // return pathArr.slice();
                var list = [];
                if (_nodeList.length > 0) {
                    for (var index = 0; index < _nodeList.length; index++) {
                        var node = _nodeList[index];
                        var pos = node.position;
                        var obj = { x: pos.x, y: pos.y, z: pos.z };
                        list.push(obj);
                    }
                } else {
                    return [];
                }
                return list;
            };
            instance.setData = function(arr) {
                instance.clearAll();
                for (var index = 0; index < arr.length; index++) {
                    draw(undefined, arr[index]);
                }
                //导入数据自动开启编辑模式
                hzThree._isEditRoute = true;
                instance.enable(hzThree._isEditRoute);
            };
            /**
             * 获取node节点数组
             * @return {[type]} [description]
             */
            instance.getNodeList = function() {
                return _nodeList;
            };

            return instance;
        }

    };
    return MapRoute;

});