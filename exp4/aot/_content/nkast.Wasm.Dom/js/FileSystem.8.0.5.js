window.nkFileSystem =
{
    GetDirectoryEntries: function (uid) {
        var dh = nkJSObject.GetObject(uid);
        var pr = (async () => {
            var en = [];
            for await (const [key, value] of dh.entries()) {
                en.push(value);
            }
            return en;
        })();
        return nkJSObject.RegisterObject(pr);
    },

    GetFileHandleName: function (uid) {
        var fh = nkJSObject.GetObject(uid);
        return fh.name;
    },

    GetFileHandleKind: function (uid) {
        var fh = nkJSObject.GetObject(uid);
        return fh.kind;
    },

    GetFile: function (uid) {
        var fh = nkJSObject.GetObject(uid);
        var pr = fh.getFile();
        return nkJSObject.RegisterObject(pr);
    },

    GetFileName: function (uid) {
        var f = nkJSObject.GetObject(uid);
        return f.name;
    },

    GetFileLastModified: function (uid) {
        var f = nkJSObject.GetObject(uid);
        return f.lastModified;
    },

    GetBlobSize: function (uid) {
        var b = nkJSObject.GetObject(uid);
        return b.size;
    },

    ReadBlobAsArrayBuffer: function (uid, d) {
        var b = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d + 0) >> 2];
        var re = new FileReader();
        var pr = new Promise((resolve, reject) => {
            re.onload = () => {
                var array = new Uint8Array(re.result);
                for (var i = 0; i < array.length; i++) {
                    Module.HEAPU8[pt + i] = array[i];
                }
                resolve(true);
            };
            re.onerror = () => reject(false);
            re.readAsArrayBuffer(b);
            return true;
        });
        return nkJSObject.RegisterObject(pr);
    },

    CreateWritable: function (uid) {
        var fh = nkJSObject.GetObject(uid);
        var pr = fh.createWritable();
        return nkJSObject.RegisterObject(pr);
    },
}

window.nkFileSystemWritableFileStream =
{
    Write: function (uid, d) {
        var wf = nkJSObject.GetObject(uid);
        var pt = Module.HEAP32[(d + 0) >> 2];
        var len = Module.HEAP32[(d + 4) >> 2];
        var dv = new DataView(Module.HEAP32.buffer, pt, len);
        var pr = wf.write(dv);
        return nkJSObject.RegisterObject(pr);
    },

    Close: function (uid) {
        var wf = nkJSObject.GetObject(uid);
        var pr = wf.close();
        return nkJSObject.RegisterObject(pr);
    },
}
