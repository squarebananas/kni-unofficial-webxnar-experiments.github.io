window.nkNavigator =
{
    gamepadMap: [],

    xrSession: null,
    xrReferenceSpace: null,
    glContext2: null,
    xrCombinedFrameData: [],
    testNotNull: "false",

    GetUserAgent: function (uid)
    {
        var nv = nkJSObject.GetObject(uid);
        return BINDING.js_to_mono_obj(nv.userAgent);
    },
    GetMaxTouchPoints: function (uid)
    {
        var nv = nkJSObject.GetObject(uid);
        return nv.maxTouchPoints;
    },
    GetGamepads: function(uid)
    {
        var nv = nkJSObject.GetObject(uid);
        var gps = nv.getGamepads();
        var uids = [];
        for (var i = 0; i < gps.length; i++)
        {
            var gp = gps[i];
            if (gp === null || gp === undefined)
            {
                nkNavigator.gamepadMap[i] = 0;
                uids[i] = 0;
            }
            else
            {
                var prevgp = null;
                if (nkNavigator.gamepadMap[i] !== 0 && nkNavigator.gamepadMap[i] !== undefined)
                    prevgp = nkJSObject.GetObject(nkNavigator.gamepadMap[i]);

                if (gp !== prevgp)
                    nkNavigator.gamepadMap[i] = nkJSObject.RegisterObject(gp);

                uids[i] = nkNavigator.gamepadMap[i];
            }
        }
        return BINDING.js_to_mono_obj(uids.toString());
    },

    GetIsSessionSupported: function GetIsSessionSupported(uid) {
        var nv = nkJSObject.GetObject(uid);
        iss = nv.xr.isSessionSupported('immersive-vr');

        var enterXrBtn = window.document.createElement('xrButton');
        enterXrBtn.style.position = 'fixed';
        enterXrBtn.innerHTML = '<BR>Click here to enter VR';
        enterXrBtn.addEventListener("pointerenter", () => { enterXrBtn.innerHTML = '<BR>Click here to enter VR (maybe?)'; });
        enterXrBtn.addEventListener("pointerleave", () => { enterXrBtn.innerHTML = '<BR>Click here to enter VR'; });
        enterXrBtn.addEventListener("pointerdown", () => {
            nv.xr.requestSession('immersive-vr')
                .then(nkNavigator.GetOnSessionStarted)
                .catch(err => { enterXrBtn.innerHTML += "<BR>" + err; });
        });
        document.body.append(enterXrBtn);
        document.body.style.fontSize = '3em';
    },
    GetOnSessionStarted: function OnSessionStarted(session) {
        nkNavigator.xrSession = session;

        nkNavigator.xrSession.requestReferenceSpace('local')
            .then((referenceSpace) => { nkNavigator.xrReferenceSpace = referenceSpace; })
            .then(() => {
                nkNavigator.xrSession.updateRenderState({
                baseLayer: new XRWebGLLayer(nkNavigator.xrSession, nkJSObject.GetObject(nkNavigator.glContext2))
                });
            })
            .then(() => { nkNavigator.xrSession.requestAnimationFrame(nkNavigator.OnDrawFrame); });
    },
    SetGLContext: function SetGLContext(uid) {
        this.glContext2 = uid;
    },
    OnDrawFrame: function OnDrawFrame(timestamp, xrFrame) {
        var glContext3 = nkJSObject.GetObject(nkNavigator.glContext2);

        if (nkNavigator.xrSession) {
            let glLayer = nkNavigator.xrSession.renderState.baseLayer;
            let pose = xrFrame.getViewerPose(nkNavigator.xrReferenceSpace);
            if (pose) {
                glContext3.bindFramebuffer(glContext3.FRAMEBUFFER, glLayer.framebuffer);

                testNotNull = (glLayer.framebuffer != null).toString();

                for (let view of pose.views) {
                    let viewport = glLayer.getViewport(view);
                    glContext3.viewport(viewport.x, viewport.y, viewport.width, viewport.height);

                    nkNavigator.xrCombinedFrameData = view.transform.matrix.toString() + "|" + view.projectionMatrix.toString() + "|" + view.eye;

                    if (nkNavigator.xrSession.inputSources.length == 2) {
                        let leftGrip = xrFrame.getPose(nkNavigator.xrSession.inputSources[1].gripSpace, nkNavigator.xrReferenceSpace);
                        let rightGrip = xrFrame.getPose(nkNavigator.xrSession.inputSources[0].gripSpace, nkNavigator.xrReferenceSpace);
                        nkNavigator.xrCombinedFrameData += "|" + leftGrip.transform.matrix.toString() + "|" + rightGrip.transform.matrix.toString();
                    }

                    DotNet.invokeMethod('nkast.Wasm.Dom', 'DrawXNA');
                }
            }
            nkNavigator.xrSession.requestAnimationFrame(nkNavigator.OnDrawFrame);
        }
        else {
            glContext3.viewport(0, 0, glContext3.glCanvas.width, glContext3.glCanvas.height);
            drawSceneFromDefaultView();
            window.requestAnimationFrame(nkNavigator.OnDrawFrame);
        }
    },
    GetBaseLayerFramebuffer: function GetBaseLayerFramebuffer() {
        //var fb = nkNavigator.xrSession.renderState.baseLayer.framebuffer != null;
        return BINDING.js_to_mono_obj(testNotNull);
    },
    GetCombinedFrameData: function GetCombinedFrameData() {
        var fd = nkNavigator.xrCombinedFrameData;
        return BINDING.js_to_mono_obj(fd);
    }
};
