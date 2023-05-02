export class HTTPResponse {
  static error(errorObj: { statusCode: number; message: string }) {
    return new Response(
      JSON.stringify({ success: false, message: errorObj.message }),
      { status: errorObj.statusCode },
    )
  }

  static success(successObj: { data: any; statusCode?: number }) {
    return new Response(
      JSON.stringify({ success: true, message: '', data: successObj.data }),
      { status: successObj.statusCode ?? 200 },
    )
  }
}
