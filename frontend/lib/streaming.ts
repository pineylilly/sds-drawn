/**
 * Generator function to stream responses from fetch calls.
 * 
 * @param {Function} fetchcall - The fetch call to make. Should return a response with a readable body stream.
 * @returns {AsyncGenerator<string>} An async generator that yields strings from the response stream.
 */
export async function* streamingFetch( fetchcall: Function ): AsyncGenerator<string> {

    const response = await fetchcall();
    // Attach Reader
    const reader = response.body.getReader();
    while (true) {
        // wait for next encoded chunk
        const { done, value } = await reader.read();
         // check if stream is done
        if (done) break;
        // Decodes data chunk and yields it
        yield (new TextDecoder().decode(value));
    }
}
/**
 * Generator function to stream responses from fetch calls.
 * 
 * @param {Function} fetchcall - The fetch call to make. Should return a response with a readable body stream.
 * @returns {AsyncGenerator<string>} An async generator that yields strings from the response stream.
 */
export async function* streamingLongResponseFetching( fetchcall: Function ): AsyncGenerator<string>  {
    const response = await fetchcall();
    // Attach Reader
    const reader = response.body.getReader();
    let cache = '';
    while (true) {
        // wait for next encoded chunk
        const { done, value } = await reader.read();
         // check if stream is done
        if (done) break;
        // Decodes data chunk and yields it
        const stringText = (new TextDecoder().decode(value));
        cache += stringText;
        if (cache.startsWith("{") && cache.endsWith("}")) {
            yield cache;
            cache = '';
        }
    }
}