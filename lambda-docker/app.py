import json
import boto3

import spacy

dynamodb_client = boto3.client('dynamodb', region_name="eu-west-2")
medicalQuestionTable = "MedicalQuestion-kqekm2jpfndc5c3rjjb3xpdbgi-local"
annotationTaskTable = 'AnnotationTask-kqekm2jpfndc5c3rjjb3xpdbgi-local'
number_required_annotators = 2


def lambda_handler(event, context):
        
    print(event)
    
    data = event.get('Records')
    
    for record in data:
        task_question_id = ""
        task_document_title = ""
    
        if (record.get("eventName") == "REMOVE"):
            task_question_id = record.get("dynamodb").get("OldImage").get("questionID").get("S")
            task_document_title = record.get("dynamodb").get("OldImage").get("document_title").get("S")
        else:
            task_question_id = record.get("dynamodb").get("NewImage").get("questionID").get("S")
            task_document_title = record.get("dynamodb").get("NewImage").get("document_title").get("S")
        
        print("task question id:")
        print(task_question_id)

        medicalQuestion = dynamodb_client.get_item(
            TableName=medicalQuestionTable,
            Key={
                'id': {'S': task_question_id},
            }
        )

        print("medical question retrieved:")
        print(medicalQuestion)

        resp = dynamodb_client.query(
           TableName=annotationTaskTable,
           IndexName='byQuestion',
           ExpressionAttributeValues={
               ':v1': {
                   'S': task_question_id,
               },
           },
           KeyConditionExpression='questionID = :v1',
        )
        print("The tasks query grouped by question id returned the following items:")
        print(resp)

        grouped_tasks = group_tasks_by_document(resp['Items'])

        print("grouped tasks")
        print(grouped_tasks)
        
        document_tasks = []

        for task in resp["Items"]:
            if task["document_title"]["S"] == task_document_title:
                document_tasks.append(task)
        
 
        if "semanticAgreement" in medicalQuestion["Item"]:
            final_similarity_scores = json.loads(medicalQuestion["Item"]["semanticAgreement"]["S"])
        else:
            final_similarity_scores = {}
        
        print("final similarity scores")
        print(final_similarity_scores)


        #######   
        completed_tasks = []
        incomplete_tasks = []
            
        tasks_to_evaluate = []

        for task in document_tasks:
            if task["completed"]["BOOL"] == False:
                incomplete_tasks.append(task)
            else:
                completed_tasks.append(task)

        print("completed tasks")
        print(completed_tasks)
        print("incomplete tasks")
        print(incomplete_tasks)

        if len(completed_tasks) < number_required_annotators:
            number_tasks_left_to_complete = number_required_annotators - len(completed_tasks)
            tasks_to_evaluate = tasks_to_evaluate + completed_tasks + incomplete_tasks[0:number_tasks_left_to_complete]
            
        elif len(completed_tasks) >= number_required_annotators:
            tasks_to_evaluate = tasks_to_evaluate + completed_tasks[0:number_required_annotators]
            
        print("tasks to evaluate")
        print(tasks_to_evaluate)

        concatonated_text = [] #list of total concatoned strings for each task
        for task in tasks_to_evaluate: 
            all_labels_string = ""
            for label in task["labels"]["L"]:
                all_labels_string += label["M"]["text"]["S"]

            concatonated_text.append(all_labels_string)
            
        print("contatonated text")
        print(concatonated_text)

        similarity_scores = []
        model = spacy.load("en_core_web_md")
        for i in range(len(concatonated_text)):
            string1 = model(concatonated_text[i])
            for j in range(i + 1, len(concatonated_text) ):
                string2 = model(concatonated_text[j])
                similarity_score = string1.similarity(string2)
                similarity_scores.append(string1.similarity(string2))
                print(similarity_score)
                
        average_similarity = 0

        labels_are_empty = True
        for string in concatonated_text:
            if string != "":
                labels_are_empty = False

        if len(similarity_scores) == 0:
            average_similarity = 0
        elif labels_are_empty == True:
            average_similarity = 0
        else:
            average_similarity = sum(similarity_scores)/len(similarity_scores)
        print("average similarity")
        print(average_similarity)

        final_similarity_scores[task_document_title] = average_similarity
        print("final similarity scores")
        print(final_similarity_scores)

        ######
        print("this is the final similarity object")
        print(final_similarity_scores)
        inputItem = json.dumps(final_similarity_scores)
     
        dynamodb_client.update_item(
            TableName=medicalQuestionTable,
            Key={
                    'id': {'S': task_question_id},
            },
            UpdateExpression='SET semanticAgreement = :val',
            ExpressionAttributeValues={
                ':val':{'S':inputItem}
            })
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


def group_tasks_by_document(tasks):
    final_grouped_tasks = []
    for task in tasks:

        duplicate_document = False

        for item in final_grouped_tasks:
            if item[0]["document_title"]["S"] == task["document_title"]["S"]:
                duplicate_document = True 

        if not duplicate_document:
            grouped_tasks = []
            for result in tasks:

                if result["document_title"]["S"] == task["document_title"]["S"]:
                    grouped_tasks.append(result)

            final_grouped_tasks.append(grouped_tasks)
    return final_grouped_tasks
















