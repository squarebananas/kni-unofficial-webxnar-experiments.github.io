﻿
window.nkXRSystem =
{
    Create: function(uid)
    {
        var nv = nkJSObject.GetObject(uid);
        if ("xr" in nv)
        {
            var xr = nv.xr;
            var uid = nkJSObject.GetUid(xr);
            if (uid !== -1)
                return uid;

            return nkJSObject.RegisterObject(xr);
        }
        else
            return nkJSObject.RegisterObject(null);
    },
    makeXRCompatible: function (uid)
    {
        var gl = nkJSObject.GetObject(uid);

        var pr = gl.makeXRCompatible();
        return nkJSObject.RegisterObject(pr);
    },

    IsSessionSupported: function(uid, d)
    {
        var xr = nkJSObject.GetObject(uid);
        var md = nkJSObject.ReadString(d, 0);

        var pr = xr.isSessionSupported(md);
        return nkJSObject.RegisterObject(pr);
    },
    RequestSession: function(uid, d)
    {
        var xr = nkJSObject.GetObject(uid);
        var md = nkJSObject.ReadString(d, 0);

        var pr = xr.requestSession(md);
        return nkJSObject.RegisterObject(pr);
    },
};

window.nkXRSession =
{
    CreateWebGLLayer: function(uid, d)
    {
        var ss = nkJSObject.GetObject(uid);
        var gcuid = Module.HEAP32[(d+ 0)>>2];

        var gc = nkJSObject.GetObject(gcuid);

        var xl = new XRWebGLLayer(ss, gc);
        return nkJSObject.RegisterObject(xl);
    },
    CreateWebGLLayer1: function(uid, d)
    {
        var ss = nkJSObject.GetObject(uid);
        var gcuid = Module.HEAP32[(d+ 0)>>2];
        var bi = Module.HEAP32[(d+ 4)>>2];
        
        var al = (bi >>  0) & 3;
        var dp = (bi >>  2) & 3;
        var st = (bi >>  4) & 3;
        var aa = (bi >>  6) & 3;
        var id = (bi >>  8) & 3;
        
        var options = {};
        if (al != 3)
            options.alpha = al !== 0;
        if (dp != 3)
            options.depth = dp !== 0;
        if (st != 3)
            options.stencil = st !== 0;
        if (aa != 3)
            options.antialias = aa !== 0;
        if (id != 3)
            options.ignoreDepthValues = id !== 0;

        var gc = nkJSObject.GetObject(gcuid);

        var xl = new XRWebGLLayer(ss, gc, options);
        return nkJSObject.RegisterObject(xl);
    },
    GetRenderState: function(uid, d)
    {
        var ss = nkJSObject.GetObject(uid);

        var rs = ss.renderState;

        var uid = nkJSObject.GetUid(rs);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(rs);
    },
    GetInputSources: function (uid, d)
    {
        var ss = nkJSObject.GetObject(uid);

        var is = ss.inputSources;
        var uid = nkJSObject.GetUid(is);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(is);
    },
    End: function (uid, d)
    {
        var ss = nkJSObject.GetObject(uid);

        var pr = ss.end();
        return nkJSObject.RegisterObject(pr);
    },
    UpdateRenderState: function(uid, d)
    {
        var ss = nkJSObject.GetObject(uid);
        var xl = Module.HEAP32[(d+ 0)>>2];

        var xlo = nkJSObject.GetObject(xl);

        ss.updateRenderState({ baseLayer: xlo });
    },
    RequestReferenceSpace: function(uid, d)
    {
        var ss = nkJSObject.GetObject(uid);
        var rs = nkJSObject.ReadString(d, 0);

        var pr = ss.requestReferenceSpace(rs);
        return nkJSObject.RegisterObject(pr);
    },
    RequestAnimationFrame: function(uid, d)
    {
        var ss = nkJSObject.GetObject(uid);
        var ci = Module.HEAP32[(d+ 0) >> 2];

        var callback = nkXRSession.RequestAnimationFrameCallback;
        var handle = ss.requestAnimationFrame((time, xrFrame) => 
        {
            callback(time, xrFrame, ci);
        });

        return handle;
    },
    RequestAnimationFrameCallback: function(time, xrFrame, ci)
    {
        var xrFrameUid = nkJSObject.GetUid(xrFrame);
        if (xrFrameUid === -1)
            xrFrameUid = nkJSObject.RegisterObject(xrFrame);

        var uid = nkJSObject.GetUid(xrFrame.session);
        if (xrFrameUid === -1)
            return;

        DotNet.invokeMethod('nkast.Wasm.XR', 'JsXRSessionOnAnimationFrame', uid, ci, time, xrFrameUid);
    },
    CancelAnimationFrame: function (uid, d)
    {
        var ss = nkJSObject.GetObject(uid);
        var rq = Module.HEAP32[(d+ 0) >> 2];

        ss.cancelAnimationFrame(rq);
    },

    RegisterEvents: function (uid)
    {
        var ss = nkJSObject.GetObject(uid);

        ss.oninputsourceschange = function (event)
        {
            DotNet.invokeMethod('nkast.Wasm.XR', 'JsXRSessionOnInputSourcesChanged', uid);
        };
        ss.onend = function (event)
        {
            DotNet.invokeMethod('nkast.Wasm.XR', 'JsXRSessionOnEnd', uid);
        };
    },
    UnregisterEvents: function (uid)
    {
        var ss = nkJSObject.GetObject(uid);
        ss.oninputsourceschange = null;
        ss.onend = null;
    }
};

window.nkXRRenderState =
{
    GetDepthNear: function(uid, d)
    {
        var rs = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];
        
        var dn = -1;
        if ('depthNear' in rs)
            dn = rs.depthNear;

        Module.HEAPF32[(pt+ 0)>>2] = dn;
    },
    GetDepthFar: function(uid, d)
    {
        var rs = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var df = -1;
        if ('depthFar' in rs)
            df = rs.depthFar;

        Module.HEAPF32[(pt+ 0)>>2] = df;
    },
    GetInlineVerticalFieldOfView: function(uid, d)
    {
        var rs = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var fo = -1;
        if ('inlineVerticalFieldOfView' in rs)
            fo = rs.inlineVerticalFieldOfView;
         if (fo === null)
             fo = -1;

        Module.HEAPF32[(pt+ 0)>>2] = fo;
    },
    GetBaseLayer: function(uid, d)
    {
        var rs = nkJSObject.GetObject(uid);

        var xl = rs.baseLayer;

        var uid = nkJSObject.GetUid(xl);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(xl);
    },

};

window.nkXRWebGLLayer =
{
    GetFramebufferWidth: function(uid, d)
    {
        var xl = nkJSObject.GetObject(uid);
        return xl.framebufferWidth;
    },
    GetFramebufferHeight: function(uid, d)
    {
        var xl = nkJSObject.GetObject(uid);
        return xl.framebufferHeight;
    },
    GetIgnoreDepthValues: function(uid, d)
    {
        var xl = nkJSObject.GetObject(uid);
        return xl.ignoreDepthValues;
    },
    GetAntialias: function(uid, d)
    {
        var xl = nkJSObject.GetObject(uid);
        return xl.antialias;
    },
    GetFramebuffer: function(uid, d)
    {
        var xl = nkJSObject.GetObject(uid);
        var fb = xl.framebuffer;
        
        var fbuid = nkJSObject.GetUid(fb);
        if (fbuid !== -1)
            return fbuid;

        return nkJSObject.RegisterObject(fb);
    },
    GetViewport: function(uid, d)
    {
        var xl = nkJSObject.GetObject(uid);
        var veuid = Module.HEAP32[(d+ 0)>>2];
        var pt = Module.HEAP32[(d+ 4)>>2];
                
        var ve = nkJSObject.GetObject(veuid);

        var vp = xl.getViewport(ve);

        Module.HEAP32[(pt+ 0)>>2] = vp.x;
        Module.HEAP32[(pt+ 4)>>2] = vp.y;
        Module.HEAP32[(pt+ 8)>>2] = vp.width;
        Module.HEAP32[(pt+12)>>2] = vp.height;

        return;
    },
};

window.nkXRFrame =
{
    GetSession: function(uid, d)
    {
        var fr = nkJSObject.GetObject(uid);

        var ss = fr.session;
        var uid = nkJSObject.GetUid(ss);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(ss);
    },
    GetViewerPose: function(uid, d)
    {
        var fr = nkJSObject.GetObject(uid);
        var rfid = Module.HEAP32[(d+ 0)>>2];

        var rf = nkJSObject.GetObject(rfid);

        var vp = fr.getViewerPose(rf);

        return nkJSObject.RegisterObject(vp);
    },
    GetPose: function(uid, d)
    {
        var fr = nkJSObject.GetObject(uid);
        var spid = Module.HEAP32[(d+ 0)>>2];
        var bsid = Module.HEAP32[(d+ 4)>>2];
        
        var sp = nkJSObject.GetObject(spid);
        var bs = nkJSObject.GetObject(bsid);

        var ps = fr.getPose(sp, bs);

        return nkJSObject.RegisterObject(ps);
    },
};

window.nkXRPose =
{
    GetEmulatedPosition: function(uid, d)
    {
        var ps = nkJSObject.GetObject(uid);

        var ep = ps.emulatedPosition;

        return ep;
    },
    GetAngularVelocity: function(uid, d)
    {
        var ps = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var av = ps.angularVelocity;
                
        if (av !== null && av !== undefined)
        {
            Module.HEAPF32[(pt+ 0)>>2] = av.x;
            Module.HEAPF32[(pt+ 4)>>2] = av.y;
            Module.HEAPF32[(pt+ 8)>>2] = av.z;
            Module.HEAPF32[(pt+12)>>2] = av.w;
            return true;
        }
        else
            return false;
    },
    GetLinearVelocity: function(uid, d)
    {
        var ps = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var lv = ps.linearVelocity;

        if (lv !== null && lv !== undefined)
        {
            Module.HEAPF32[(pt+ 0)>>2] = lv.x;
            Module.HEAPF32[(pt+ 4)>>2] = lv.y;
            Module.HEAPF32[(pt+ 8)>>2] = lv.z;
            Module.HEAPF32[(pt+12)>>2] = lv.w;
            return true;
        }
        else
            return false;
    },
    GetTransform: function(uid, d)
    {
        var ps = nkJSObject.GetObject(uid);

        var tf = ps.transform;
        var uid = nkJSObject.GetUid(tf);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(tf);
    },
};

window.nkXRViewerPose =
{
    GetViews: function(uid, d)
    {
        var vp = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var vs = vp.views;

        for (var i=0; i < vs.length; i++)
        {
            var view = vs[i];            
            var vid = nkJSObject.GetUid(view);
            if (vid === -1)
                vid = nkJSObject.RegisterObject(view);

            Module.HEAP32[(pt+ i*4)>>2] = vid;
        }

        return vs.length;
    },
};

window.nkXRView =
{
    GetTransform: function(uid, d)
    {
        var ve = nkJSObject.GetObject(uid);

        var tf = ve.transform;
        var uid = nkJSObject.GetUid(tf);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(tf);
    },
    GetProjectionMatrix: function(uid, d)
    {
        var ve = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var mt = ve.projectionMatrix;

        Module.HEAPF32[(pt+ 0)>>2] = mt[00];
        Module.HEAPF32[(pt+ 4)>>2] = mt[01];
        Module.HEAPF32[(pt+ 8)>>2] = mt[02];
        Module.HEAPF32[(pt+12)>>2] = mt[03];

        Module.HEAPF32[(pt+16)>>2] = mt[04];
        Module.HEAPF32[(pt+20)>>2] = mt[05];
        Module.HEAPF32[(pt+24)>>2] = mt[06];
        Module.HEAPF32[(pt+28)>>2] = mt[07];

        Module.HEAPF32[(pt+32)>>2] = mt[08];
        Module.HEAPF32[(pt+36)>>2] = mt[09];
        Module.HEAPF32[(pt+40)>>2] = mt[10];
        Module.HEAPF32[(pt+44)>>2] = mt[11];

        Module.HEAPF32[(pt+48)>>2] = mt[12];
        Module.HEAPF32[(pt+52)>>2] = mt[13];
        Module.HEAPF32[(pt+56)>>2] = mt[14];
        Module.HEAPF32[(pt+60)>>2] = mt[15];

        return;
    },
    GetEye: function(uid, d)
    {
        var ve = nkJSObject.GetObject(uid);

        var ey = ve.eye;
        
        if (ey === 'left')
            return 1;
        if (ey === 'right')
            return 2;

        return 0;
    },
};

window.nkXRRigidTransform =
{
    GetOrientation: function(uid, d)
    {
        var rt = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var or = rt.orientation;

        Module.HEAPF32[(pt+ 0)>>2] = or.x;
        Module.HEAPF32[(pt+ 4)>>2] = or.y;
        Module.HEAPF32[(pt+ 8)>>2] = or.z;
        Module.HEAPF32[(pt+12)>>2] = or.w;

        return;
    },
    GetPosition: function(uid, d)
    {
        var rt = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var ps = rt.position;
        
        Module.HEAPF32[(pt+ 0)>>2] = ps.x;
        Module.HEAPF32[(pt+ 4)>>2] = ps.y;
        Module.HEAPF32[(pt+ 8)>>2] = ps.z;
        Module.HEAPF32[(pt+12)>>2] = ps.w;

        return;
    },
    GetMatrix: function(uid, d)
    {
        var rt = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d+ 0)>>2];

        var mt = rt.matrix;

        Module.HEAPF32[(pt+ 0)>>2] = mt[00];
        Module.HEAPF32[(pt+ 4)>>2] = mt[01];
        Module.HEAPF32[(pt+ 8)>>2] = mt[02];
        Module.HEAPF32[(pt+12)>>2] = mt[03];

        Module.HEAPF32[(pt+16)>>2] = mt[04];
        Module.HEAPF32[(pt+20)>>2] = mt[05];
        Module.HEAPF32[(pt+24)>>2] = mt[06];
        Module.HEAPF32[(pt+28)>>2] = mt[07];

        Module.HEAPF32[(pt+32)>>2] = mt[08];
        Module.HEAPF32[(pt+36)>>2] = mt[09];
        Module.HEAPF32[(pt+40)>>2] = mt[10];
        Module.HEAPF32[(pt+44)>>2] = mt[11];

        Module.HEAPF32[(pt+48)>>2] = mt[12];
        Module.HEAPF32[(pt+52)>>2] = mt[13];
        Module.HEAPF32[(pt+56)>>2] = mt[14];
        Module.HEAPF32[(pt+60)>>2] = mt[15];

        return;
    },
    GetInverse: function(uid, d)
    {
        var rt = nkJSObject.GetObject(uid);

        var tf = rt.inverse;
        var uid = nkJSObject.GetUid(tf);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(tf);
    },
};

window.nkXRInputSource =
{
    GetGripSpace: function (uid, d)
    {
        var is = nkJSObject.GetObject(uid);

        var gs = is.gripSpace;

        var uid = nkJSObject.GetUid(gs);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(gs);
    },
    GetTargetRaySpace: function (uid, d)
    {
        var is = nkJSObject.GetObject(uid);

        var ps = is.targetRaySpace;

        var uid = nkJSObject.GetUid(ps);
        if (uid !== -1)
            return uid;

        return nkJSObject.RegisterObject(ps);
    },
    GetHandedness: function (uid, d)
    {
        var is = nkJSObject.GetObject(uid);

        var ha = is.handedness;

        if (ha === 'left')
            return 1;
        if (ha === 'right')
            return 2;

        return 0;
    },
    GetGamepad: function (uid, d)
    {
        var is = nkJSObject.GetObject(uid);

        var gp = is.gamepad;

        var uid = nkJSObject.GetUid(gp);
        if (uid !== -1)
            return uid;
            
        return nkJSObject.RegisterObject(gp);
    },

};