////////////////////////////////////////////////////////////
/// 汎用メソッド群
////////////////////////////////////////////////////////////
VOCODER.Util = {};

////////////////////////////////////////////////////////////
/// data（配列）をArrayBufferに変換する
////////////////////////////////////////////////////////////
VOCODER.Util.ToArrayBuffer = function(buf) {
    var arrayBuffer = new ArrayBuffer(buf.length);
    var view        = new Uint8Array(arrayBuffer);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }

    return arrayBuffer;
};

////////////////////////////////////////////////////////////
/// ファイル選択ダイアログを開き、音声ファイルを選択する
////////////////////////////////////////////////////////////
VOCODER.Util.OpenSoundFileDialog = function() {
    var currentWindow = VOCODER.remote.getCurrentWindow();
    var options       = {
        title: '音声ファイルを選択してください',
        filters: [
            {
                name: 'Sound File',
                extensions: ['wav', 'mp3']
            }
        ],
        properties: ['openFile', 'createDirectory']
    };

    // ファイル選択ダイアログを開く
    var result = VOCODER.dialog.showOpenDialog(currentWindow, options);

    if (typeof result === 'undefined' || result === null || result.length <= 0) {
        return false;
    }

    return result[0];
};

