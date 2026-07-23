resource "aws_lambda_function" "get_my_bids_lambda" {
  filename         = data.archive_file.get_my_bids_zip.output_path
  function_name    = "TaskLah_GetMyBids"
  role             = aws_iam_role.lambda_exec_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.get_my_bids_zip.output_base64sha256

  environment {
    variables = {
      TIDB_CONNECTION_STRING = var.tidb_connection_string
    }
  }
}

data "archive_file" "get_my_bids_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../backend/dist/getMyBids"
  output_path = "${path.module}/getMyBids.zip"
}

resource "aws_apigatewayv2_integration" "get_my_bids_integration" {
  api_id             = aws_apigatewayv2_api.tasklah_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_my_bids_lambda.invoke_arn
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "get_my_bids_route" {
  api_id    = aws_apigatewayv2_api.tasklah_api.id
  route_key = "GET /bids/my"
  target    = "integrations/${aws_apigatewayv2_integration.get_my_bids_integration.id}"
}

resource "aws_lambda_permission" "api_gw_get_my_bids_permission" {
  statement_id  = "AllowExecutionFromAPIGatewayGetMyBids"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_my_bids_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.tasklah_api.execution_arn}/*/*"
}
