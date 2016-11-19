$(function() {
    console.info('Start "Vocoder".');

    // ウィンドウの内部要素の更新（ウィンドウリサイズ時・可視状態の変更時）
    var RefreshWindow = function() {
    };

    // ウィンドウサイズへのフィット処理
    (function() {
        $(window).on('resize', RefreshWindow);
    }());

    (function() {
        var audioCtx = new AudioContext();

        var oscillator = audioCtx.createOscillator();

        oscillator.connect(audioCtx.destination);

        oscillator.start();
    }());

    RefreshWindow();
});

