export TARGET_BUCKET=$1

if ["$1" = ""]; then
    echo "Usage: source deploy.sh s3-bucket-name"
    exit 1
else
    echo "Installing dependencies"
    export CI=false
    npm install
    echo "Building ..."
    npm run build
    echo "Starting Deployment"
    echo "TARGET BUCKET" + $TARGET_BUCKET
    echo " INSTALLING AWS CLI "
    apt-get update
    apt-get install -y python python-dev python-pip
    pip install awscli --upgrade

    echo "CONFIGURING AWS"
    # Configure AWS Access Key ID
    aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID --profile default

    # Configure AWS Secret Access Key
    aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY --profile default

    # Configure AWS default region
    aws configure set region $AWS_DEFAULT_REGION --profile default

    aws s3 sync build/ s3://${TARGET_BUCKET} 
fi
