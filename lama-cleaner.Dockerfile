FROM python:3.11-slim

# Install dependencies
RUN apt-get update \
    && apt-get install wget bash -y \
#    && apt-get install ffmpeg libsm6 libxext6 wget bash -y \
    && pip install --upgrade pip \
    && python -m venv myenv \
    && source myenv/bin/activate \
    && pip install lama-cleaner rembg \
    && apt-get clean \
    && mkdir -p /root/.cache/torch/hub/checkpoints \
    && wget -O /root/.cache/torch/hub/checkpoints/big-lama.pt  https://github.com/Sanster/models/releases/download/add_big_lama/big-lama.pt

# lama-cleaner --model=lama --device=cpu --host=0.0.0.0 --port=8080 --disable-model-switch --enable-remove-bg
ENTRYPOINT ["lama-cleaner"]

CMD ["--model=lama", "--device=cpu", "--host=0.0.0.0", "--port=8080", "--disable-model-switch", "--enable-remove-bg"]
