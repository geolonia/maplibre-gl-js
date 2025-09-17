/**
 * 操作が中止された時に使用するエラーメッセージ
 */
export const ABORT_ERROR = 'AbortError';

/**
 * エラーが中止エラーかどうかをチェックする
 * @param error - エラーオブジェクト
 * @returns - エラーが中止エラーの場合はtrue
 */
export function isAbortError(error: Error): boolean {
    return error.message === ABORT_ERROR;
}

/**
 * 中止エラーを作成する必要がある場合に使用する。
 * @returns "AbortError"メッセージを持つエラーオブジェクト
 */
export function createAbortError(): Error {
    return new Error(ABORT_ERROR);
}
