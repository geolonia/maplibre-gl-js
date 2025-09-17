import {interpolates} from '@maplibre/maplibre-gl-style-spec';
import Point from '@mapbox/point-geometry';
import {clamp, type Complete, type RequireAtLeastOne} from '../util/util';

/**
 * `EdgeInset` オブジェクトは、ビューポートの端に適用される画面上のパディングを表します。
 * これにより、マップの見かけ上の中心点や消失点がシフトします。これは、マップ上にフローティングUI要素を追加し、
 * UI要素のサイズ変更に応じて消失点を移動させたい場合に便利です。
 *
 * @group Geography and Geometry
 */
export class EdgeInsets {
    /**
     * @defaultValue 0
     */
    top: number;
    /**
     * @defaultValue 0
     */
    bottom: number;
    /**
     * @defaultValue 0
     */
    left: number;
    /**
     * @defaultValue 0
     */
    right: number;

    constructor(top: number = 0, bottom: number = 0, left: number = 0, right: number = 0) {
        if (isNaN(top) || top < 0 ||
            isNaN(bottom) || bottom < 0 ||
            isNaN(left) || left < 0 ||
            isNaN(right) || right < 0
        ) {
            throw new Error('Invalid value for edge-insets, top, bottom, left and right must all be numbers');
        }

        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }

    /**
     * インセットをインプレースで補間します。
     * `target` に存在しないインセット値は現在の値を維持します。
     * @param start - 補間の開始値
     * @param target - 補間の目標値
     * @param t - 補間のステップ／重み
     * @returns インセット
     */
    interpolate(start: PaddingOptions | EdgeInsets, target: PaddingOptions, t: number): EdgeInsets {
        if (target.top != null && start.top != null) this.top = interpolates.number(start.top, target.top, t);
        if (target.bottom != null && start.bottom != null) this.bottom = interpolates.number(start.bottom, target.bottom, t);
        if (target.left != null && start.left != null) this.left = interpolates.number(start.left, target.left, t);
        if (target.right != null && start.right != null) this.right = interpolates.number(start.right, target.right, t);

        return this;
    }

    /**
     * インセットを適用した後の新しい見かけ上の中心点（消失点）を計算するユーティリティメソッドです。
     * 単位はピクセルで、左上が (0.0)、+y が下方向になります。
     *
     * @param width - 幅
     * @param height - 高さ
     * @returns 中心点
     */
    getCenter(width: number, height: number): Point {
        // Clamp insets so they never overflow width/height and always calculate a valid center
        const x = clamp((this.left + width - this.right) / 2, 0, width);
        const y = clamp((this.top + height - this.bottom) / 2, 0, height);

        return new Point(x, y);
    }

    equals(other: PaddingOptions): boolean {
        return this.top === other.top &&
            this.bottom === other.bottom &&
            this.left === other.left &&
            this.right === other.right;
    }

    clone(): EdgeInsets {
        return new EdgeInsets(this.top, this.bottom, this.left, this.right);
    }

    /**
     * 現在の状態を JSON として返します。インセットの読み取り専用表現が必要な場合に便利です。
     *
     * @returns 状態を JSON で返します
     */
    toJSON(): Complete<PaddingOptions> {
        return {
            top: this.top,
            bottom: this.bottom,
            left: this.left,
            right: this.right
        };
    }
}

/**
 * {@link Map.fitBounds}、{@link Map.fitScreenCoordinates}、{@link Map.setPadding} などのメソッド呼び出し時にパディングを設定するためのオプションです。これらのオプションを調整することで、キャンバスの端に追加されるパディング量（ピクセル単位）を設定できます。すべての端に均一なパディングを設定するか、各端ごとに個別の値を指定できます。このオブジェクトのすべてのプロパティは、負でない整数でなければなりません。
 *
 * @group Geography and Geometry
 *
 * @example
 * ```ts
 * let bbox = [[-79, 43], [-73, 45]];
 * map.fitBounds(bbox, {
 *   padding: {top: 10, bottom:25, left: 15, right: 5}
 * });
 * ```
 *
 * @example
 * ```ts
 * let bbox = [[-79, 43], [-73, 45]];
 * map.fitBounds(bbox, {
 *   padding: 20
 * });
 * ```
 * @see [ラインストリングの境界に合わせてズームする](https://maplibre.org/maplibre-gl-js/docs/examples/zoomto-linestring/)
 * @see [マップをバウンディングボックスに合わせる](https://maplibre.org/maplibre-gl-js/docs/examples/fitbounds/)
 */
export type PaddingOptions = RequireAtLeastOne<{
    /**
     * マップキャンバスの上端からのパディング（ピクセル単位）。
     */
    top: number;
    /**
     * マップキャンバスの下端からのパディング（ピクセル単位）。
     */
    bottom: number;
    /**
     * マップキャンバスの左端からのパディング（ピクセル単位）。
     */
    right: number;
    /**
     * マップキャンバスの右端からのパディング（ピクセル単位）。
     */
    left: number;
}>;
